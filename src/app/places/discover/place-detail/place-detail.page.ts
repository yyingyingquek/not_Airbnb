import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/bookings.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable: boolean = false;
  private placeSubscription: Subscription;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingsService,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSubscription = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
        });
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover') - using Angular router; cant do the animation
    // this.navController.navigateBack('/places/tabs/discover');
    // this.navController.pop() - does not work if there is nothing in the stack to pop from
    this.actionSheetController
      .create({
        header: 'Choose an action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          // {
          //   text: 'Random Date',
          //   handler: () => {
          //     this.openBookingModal('random');
          //   },
          // },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetElement) => {
        actionSheetElement.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController
      .create({
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this.loadingController
            .create({ message: 'Booking in progress...' })
            .then((loadingElement) => {
              loadingElement.present();
              const data = resultData.data.bookingData;
              console.log('BOOKED!');
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingElement.dismiss();
                });
            });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
