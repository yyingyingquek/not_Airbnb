import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'St Regis New York',
      'Idk what is in NYC tbh',
      'https://hips.hearstapps.com/hbz.h-cdn.co/assets/16/21/st-regis-81gr-109953-diorsuitelivingroom_1.jpg?crop=1xw:1.0xh;center,top&resize=980:*',
      420,
      new Date('2022-06-15'),
      new Date('2022-12-31'),
      'YY'
    ),
    new Place(
      'p2',
      'Shangri La Paris',
      'Why not spend your money in Chanel and Shangri La at Paris?',
      'https://sitecore-cd-imgr.shangri-la.com/MediaFiles/5/9/3/%7B593A0FBA-B7D5-4814-8604-CDB679819A1C%7D20211017_SLPR_AboutImageWithLogo_120x700.jpg?w=600&h=500&mode=crop&scale=both',
      490,
      new Date('2022-06-15'),
      new Date('2022-12-31'),
      '123'
    ),
    new Place(
      'p3',
      'Yamamizuku Ryokan Japan',
      'Well, Kumamoto is well known for their hot springs',
      'https://www.img-ikyu.com/contents/dg/guide/acc1/00001801/img/a_ss_01_191010.jpg?auto=compress,format&fit=crop&lossless=0&w=1920&h=600&q=30',
      432,
      new Date('2022-06-15'),
      new Date('2022-12-31'),
      'YY'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((place) => place.id === id) };
      })
    );
  }

  addListing(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://www.img-ikyu.com/contents/dg/guide/acc1/00001801/img/a_ss_01_191010.jpg?auto=compress,format&fit=crop&lossless=0&w=1920&h=600&q=30',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        setTimeout(() => {
          this._places.next(places.concat(newPlace));
        }, 1000);
      })
    );
  }

  updateListing(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((placesArr) => {
        const updatedPlaceIndex = placesArr.findIndex(
          (place) => place.id === placeId
        );
        const updatedPlaces = [...placesArr];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
