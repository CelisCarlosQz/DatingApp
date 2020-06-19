import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-matches-detail',
  templateUrl: './matches-detail.component.html',
  styleUrls: ['./matches-detail.component.css']
})
export class MatchesDetailComponent implements OnInit {
  @ViewChild('memberTab', {static: true}) memberTab: TabsetComponent;
  user: User;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AlertifyService,
      private routes: ActivatedRoute) { } // Activated Route To Retrieve The ID

  ngOnInit() {
    this.routes.data.subscribe(data => {
      this.user = data['user'];
    });

    this.routes.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTab.tabs[selectedTab > 0 ? selectedTab: 0].active = true;
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  selectTab(tabId: number){
    this.memberTab.tabs[tabId].active = true;
  }

  getImages() {
    const imagesUrls = [];
    for (const photo of this.user.photos) {
      imagesUrls.push({
        small: photo.url,
        medium: photo.url,
        high: photo.url,
        description: photo.description
      });
    }
    return imagesUrls;
  }

}
