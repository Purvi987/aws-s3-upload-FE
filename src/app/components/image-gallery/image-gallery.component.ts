import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'be-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit, OnChanges {
  @Input() images!: any[];
  filteredImages!: any[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: SimpleChanges) {
    this.filteredImages = this.images;
  }

  searchTextChanged(event: any) {
    let arr = this.images.filter((image) => image.title.toLowerCase().includes(event.toLowerCase()) || image.tag.toLowerCase().includes(event.toLowerCase()));
    this.filteredImages = arr.length
      ? arr
      : [{ name: 'No Item found', code: 'null' }];
  }
}
