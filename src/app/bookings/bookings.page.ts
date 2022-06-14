import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Bookings } from './bookings.model';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Bookings[];
  private bookingSubscription: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSubscription = this.bookingsService.bookings.subscribe(
      (bookings) => {
        this.loadedBookings = bookings;
      }
    );
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    this.loadingController
      .create({ message: 'Cancelling...' })
      .then((loadingElement) => {
        loadingElement.present();
        this.bookingsService.cancelBooking(bookingId).subscribe(() => {
          loadingElement.dismiss();
        });
      });
  }

  ngOnDestroy(): void {
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }
}
