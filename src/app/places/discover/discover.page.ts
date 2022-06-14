import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  filterPlaces: Place[];
  isLoading: boolean = false;
  private filter = 'all-listing';
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.placesSubscription = this.placesService.places.subscribe((places) => {
    //   this.loadedPlaces = places;
    //   this.filterPlaces = this.loadedPlaces;
    // });
    // console.log(this.filterPlaces);
    this.placesSubscription = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this.filter);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchListings().subscribe(() => {
      this.isLoading = false;
    });
  }

  // approach for opening side drawer programmatically
  // onOpenMenu() {
  //   this.menuController.toggle();
  // }

  onFilterUpdate(filter: string) {
    // console.log(event.detail.value);
    // if (event.detail.value === 'all-listing') {
    //   this.filterPlaces = this.loadedPlaces;
    //   console.log(this.filterPlaces);
    // } else if (event.detail.value === 'bookable-listing') {
    //   // idk why this is not working
    //   this.filterPlaces = this.loadedPlaces.filter((placeArr) => {
    //     placeArr.userId !== this.authService.userId;
    //   });
    // }

    // somehow this works with screaming errors in HTML
    const isShown = (place: any) =>
      filter === 'all-listing' || place.userId !== this.authService.userId;
    this.filterPlaces = this.loadedPlaces.filter(isShown);
    this.filter = filter;
  }

  ngOnDestroy(): void {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
