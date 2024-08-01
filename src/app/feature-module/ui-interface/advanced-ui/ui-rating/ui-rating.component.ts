import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';
import { Star } from 'src/app/core/services/interface/models';



@Component({
  selector: 'app-ui-rating',
  templateUrl: './ui-rating.component.html',
  styleUrl: './ui-rating.component.scss'
})
export class UiRatingComponent {
  public routes = routes;

  basicStar = [
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
  ];
  basicStar1 = [
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
  ];
  savedStar = [
    { show: true },
    { show: true },
    { show: true },
    { show: false },
    { show: false },
  ];
  maxStar = [
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    
  ];
  readOnlyStar = [
    { show: true },
    { show: true },
    { show: true },
    { show: true },
    { show: true },
    { show: true },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
  ];
  halfRatingStar = [
    { show: true, half: false },
    { show: true, half: false },
    { show: false, half: true },
    { show: false, half: false },
    { show: false, half: false },
  ];
  heartIcon = [
    { show: false },
    { show: false },
    { show: false },
    { show: false },
    { show: false },
  ];


  clickBasicStar(item: Star, i: number, array: Star[]): void {
    if (item.show == false) {
      array.map((res: Star, index: number) => {
        if (index <= i) {
          res.show = true;
        }
      });
    } else {
      array.map((res: Star, index: number) => {
        if (index >= i && index != 0) {
          res.show = false;
        }
      });
    }
    
    if (array === this.halfRatingStar) {
      array.map((res: Star) => {
        res.half = false;
      });
    }
    
  }
  clickBasicStar1(item: Star, i: number, array: Star[]): void {
    if (item.show == false) {
      array.map((res: Star, index: number) => {
        if (index <= i) {
          res.show = true;
        }
      });
    } else {
      array.map((res: Star, index: number) => {
        if (index >= i && index != 0) {
          res.show = false;
        }
      });
    }
    this.increaseRating()
    if (array === this.halfRatingStar) {
      array.map((res: Star) => {
        res.half = false;
      });
    }
    
    
  }
 
  liveRating = 1;
  increaseRating() {
    this.liveRating++;
  }
  resetStars(): void {
    // Reset the state of heartIcon array to its initial state
    this.heartIcon.forEach((item) => {
      item.show = false;
      // Reset any other properties as needed
    });
  }
  // hoverStar(index: number, basicStar: any[]): void {
  //   for (let i = 0; i <= index; i++) {
  //     if (basicStar[i]) {
  //       basicStar[i].show = true;
  //     }
  //   }

  //   for (let i = index + 1; i < basicStar.length; i++) {
  //     if (basicStar[i]) {
  //       basicStar[i].show = false;
  //     }
  //   }
  // }
  hoverStar1(isHovered: boolean, index: number, halfRatingStar: any[]): void {
    const item = halfRatingStar[index];
    if (item && item.half) {
      item.hover = isHovered;
    }
  }
  hoverStar(index: number, array: any[]): void {
    for (let i = 0; i <= index; i++) {
      if (array[i]) {
        array[i].show = true;
      }
    }
  
    for (let i = index + 1; i < array.length; i++) {
      if (array[i]) {
        array[i].show = false;
      }
    }
  }
   // bread crumb items
   breadCrumbItems!: Array<{}>;
   readonly = false;
   defaultSelect = 3;
   currentRate = 2;
   customColor = 4;
   hoverSelect = 2;
   hovered = 0;
   clearRate = 2;
 
   constructor() { }
 
   ngOnInit(): void {
     /**
     * BreadCrumb
     */
      this.breadCrumbItems = [
       { label: 'Advance UI' },
       { label: 'Ratings', active: true }
     ];
   }
 
 
}
