import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './bookings.model';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private _bookings = new BehaviorSubject<Bookings[]>([]);

  // private _bookings: Bookings[] = [
  //   {
  //     id: 'abc',
  //     placeId: 'p1',
  //     userId: 'yy',
  //     placeTitle: 'St Regis New York',
  //     guestNumber: 4,
  //   },
  // ];

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNum: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Bookings(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNum,
      dateFrom,
      dateTo
    );
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(
          bookings.filter((bookingArr) => {
            bookingArr.id !== bookingId;
          })
        );
      })
    );
  }
}
