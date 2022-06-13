import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'St Regis New York',
      'Idk what is in NYC tbh',
      'https://hips.hearstapps.com/hbz.h-cdn.co/assets/16/21/st-regis-81gr-109953-diorsuitelivingroom_1.jpg?crop=1xw:1.0xh;center,top&resize=980:*',
      420,
      new Date('2022-06-15'),
      new Date('2022-12-31')
    ),
    new Place(
      'p2',
      'Shangri La Paris',
      'Why not spend your money in Chanel and Shangri La at Paris?',
      'https://sitecore-cd-imgr.shangri-la.com/MediaFiles/5/9/3/%7B593A0FBA-B7D5-4814-8604-CDB679819A1C%7D20211017_SLPR_AboutImageWithLogo_120x700.jpg?w=600&h=500&mode=crop&scale=both',
      490,
      new Date('2022-06-15'),
      new Date('2022-12-31')
    ),
    new Place(
      'p3',
      'Yamamizuku Ryokan Japan',
      'Well, Kumamoto is well known for their hot springs',
      'https://www.img-ikyu.com/contents/dg/guide/acc1/00001801/img/a_ss_01_191010.jpg?auto=compress,format&fit=crop&lossless=0&w=1920&h=600&q=30',
      432,
      new Date('2022-06-15'),
      new Date('2022-12-31')
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string) {
    return { ...this._places.find((place) => place.id === id) };
  }
}
