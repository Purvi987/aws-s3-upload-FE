import {
  Component,
  OnInit,
  Input,
  OnChanges
} from '@angular/core';


@Component({
  selector: 'be-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit, OnChanges {
  
  @Input() images!: any[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(change: any) {}

}
