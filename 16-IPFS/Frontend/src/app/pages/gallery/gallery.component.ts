import { Component, ViewEncapsulation, ViewChild } from "@angular/core";

// import Swiper core and required modules
import SwiperCore, { Navigation, SwiperOptions } from "swiper";

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: "gallery",
  template: `<div class="gallery-root">
    <button type="button" class="btn btn-primary btn-lg" routerLink="/">Home</button>
    <!-- <button type="button" class="btn btn-primary btn-lg" routerLink="gallery">Gallery</button> -->
    <h1 class="title">
      Image Gallery
    </h1>
    <swiper
      [navigation]="true"
      class="mySwiper"
      [spaceBetween]="50"
      (swiper)="onSwiper($event)"
      (slideChange)="onSlideChange()"
    >
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
      <ng-template swiperSlide><img src="../assets/images/cat.jpeg" alt="cat"></ng-template>
    </swiper>
  </div>`,
  // styleUrls: ["./app.components.scss"],
  styleUrls: ['./gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent {
  config: SwiperOptions = {
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  onSwiper(swiper: Event) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
