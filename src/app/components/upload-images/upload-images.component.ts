import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/file-upload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss'],
})
export class UploadImagesComponent implements OnInit {
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  url: any;
  file: any;

  images: any = [];
  galleryImages: any = [];
  filteredImages: any = [];
  formGroup!: FormGroup;
  imageUrl = '../../../assets/images/placeholder.jpg';
  currentKey: any = '';
  imageInfo: any = [];

  dataObj: any = {
    id: '',
    image: '',
    key: '',
    title: '',
    tag: '',
  };

  constructor(
    private uploadService: FileUploadService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.getListImages();
    this.createForm();
    this.getPreSignUrl();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      image: [null],
      key: [''],
      title: [null, Validators.required],
      tag: [null, Validators.required],
    });
  }

  getPreSignUrl() {
    this.uploadService.getPreSignUrl().subscribe((data) => {
      this.url = data.url;
      this.currentKey = data.url
        .split('/')
        [data.url.split('/').length - 1].split('?')[0];
    });
  }

  getListImages() {
    this.uploadService.geListImage().subscribe((data) => {
      this.images = data.image;
    });
    this.getImageInfo();
  }

  getImageInfo() {
    this.dataService.getdata().subscribe((info: any) => {
      if (info) {
        this.imageInfo = info;
        this.mapIamgeInfo();
      }
    });
  }

  mapIamgeInfo() {
    this.galleryImages = this.images.map((item1: any) => {
      const common = this.imageInfo.find(
        (item2: any) =>
          item2.key == item1.split('/')[item1.split('/').length - 1]
      );
      return { imageUrl: item1, ...common };
    });
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;
    this.file = event.target.files[0];
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(this.selectedFiles[i]);
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    if (file) {
      this.uploadService.uploadFile(this.url, this.file).subscribe(
        (event: any) => {
          this.getListImages();
          this.formGroup.reset();
          this.imageUrl = '../../../assets/images/placeholder.jpg';
          this.snackBar.open('Image uploaded successfully!!', '', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['custom-success'],
          });
          // if (event.type === HttpEventType.UploadProgress) {
          //   this.progressInfos[idx].value = Math.round(
          //     (100 * event.loaded) / event.total
          //   );
          // }
          if (event instanceof HttpResponse) {
            const msg = file.name + ': Successful!';
            this.message.push(msg);
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          let msg = file.name + ': Failed!';

          if (err.error || err.error.message) {
            msg += ' ' + err.error.match(/<Message>(.*?)<\/Message>/)[0];
            this.snackBar.open(msg, '', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['custom-error'],
            });
          }
          this.message.push(msg);
        }
      );
    }
  }

  uploadFiles(): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  async onSubmit(data: any) {
    await this.uploadFiles();
    this.dataObj.id = '';
    this.dataObj.image = this.file.name;
    this.dataObj.key = this.currentKey;
    this.dataObj.title = data.title;
    this.dataObj.tag = data.tag;
    this.dataService.addData(this.dataObj).then((data) => {
      if (data) {
        console.log(`Hi ${data}`);
      }
    });
  }
}
