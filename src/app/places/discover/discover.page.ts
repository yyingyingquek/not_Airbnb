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
  private filter = 'all-listing';
  private placesSubscription: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.placesSubscription = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.filterPlaces = this.loadedPlaces;
    });
    console.log(this.loadedPlaces);
  }

  // approach for opening side drawer programmatically
  // onOpenMenu() {
  //   this.menuController.toggle();
  // }

  onFilterUpdate(event: any) {
    console.log(event.detail.value);
    if (event.detail.value === 'all-listing') {
      this.filterPlaces = this.loadedPlaces;
    } else {
      // idk why this is not working
      this.filterPlaces = this.loadedPlaces.filter((place) => {
        place.userId !== this.authService.userId;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }
}
