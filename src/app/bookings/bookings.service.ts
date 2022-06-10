import { Injectable } from '@angular/core';
import { Bookings } from './bookings.model';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private _bookings: Bookings[] = [
    {
      id: 'abc',
      placeId: 'p1',
      userId: 'yy',
      placeTitle: 'St Regis New York',
      guestNumber: 4,
    },
  ];

  get bookings() {
    return [...this._bookings];
  }

  constructor() {}
}
