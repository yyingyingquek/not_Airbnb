import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from '../shared/location.model';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchListings() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/offered-listings.json'
      )
      .pipe(
        take(1),
        map((responseData) => {
          const placesArr = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              placesArr.push(
                new Place(
                  key,
                  responseData[key].title,
                  responseData[key].description,
                  responseData[key].imageUrl,
                  responseData[key].price,
                  new Date(responseData[key].availableFrom),
                  new Date(responseData[key].availableTo),
                  responseData[key].userId,
                  responseData[key].location
                )
              );
            }
          }
          return placesArr;
          // return [];
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/offered-listings/${id}.json`
      )
      .pipe(
        take(1),
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      'https://us-central1-not-airbnb.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addListing(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No User found');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          availableFrom,
          availableTo,
          userId,
          location
        );
        return this.http.post<{ name: string }>(
          'https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/offered-listings.json',
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap((responseData) => {
        generatedId = responseData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updateListing(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchListings();
        } else {
          return of(places);
        }
      }),
      // guaranteed array
      switchMap((placesArr) => {
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
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://not-airbnb-default-rtdb.asia-southeast1.firebasedatabase.app/offered-listings/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
