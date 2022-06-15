import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchAll, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Bookings } from './bookings.model';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

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

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    let generatedId: string;
    let newBooking: Bookings;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found');
        }
        newBooking = new Bookings(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNum,
          dateFrom,
          dateTo
        );
        return this.http.post<{ name: string }>(
          'https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json',
          { ...newBooking, id: null }
        );
      }),
      switchMap((responseData) => {
        generatedId = responseData.name;
        return this.bookings;
      }),
      take(1),
      tap((bookings) => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found');
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map((bookingData) => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Bookings(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].guestNumber,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap((bookings) => {
        this._bookings.next(bookings);
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
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
