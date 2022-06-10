import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Bookings } from './bookings.model';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Bookings[];

  constructor(private bookingsService: BookingsService) {}

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onCancelBooking(offerId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    // cancel booking with the id - wip
  }
}
