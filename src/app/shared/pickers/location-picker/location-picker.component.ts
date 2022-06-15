import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';

import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Coordinates, PlaceLocation } from '../../location.model';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPicked = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading: boolean = false;

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetController
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto-locate',
            handler: () => {
              this.autoLocateUser();
            },
          },
          {
            text: 'Choose on Map',
            handler: () => {
              this.openMapModal();
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((actionSheetElement) => {
        actionSheetElement.present();
      });
  }

  // seems like not working?
  private async autoLocateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.errorAlert();
      return;
    }
    this.isLoading = true;
    // const coordinates = await Geolocation.getCurrentPosition();
    // console.log('Current position:', coordinates);
    await Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        };
        this.createMapLocation(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorAlert();
      });
  }

  private errorAlert() {
    this.alertController
      .create({
        header: 'Unable to get location',
        message: 'Please choose via the map',
        buttons: ['Okay'],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }

  private createMapLocation(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapUrl) => {
        pickedLocation.staticMapImageUrl = staticMapUrl;
        this.selectedLocationImage = staticMapUrl;
        this.isLoading = false;
        this.locationPicked.emit(pickedLocation);
      });
  }

  private openMapModal() {
    this.modalController
      .create({ component: MapModalComponent })
      .then((modalElement) => {
        modalElement.onDidDismiss().then((modalData) => {
          console.log(modalData.data);
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createMapLocation(coordinates.lat, coordinates.lng);
        });
        modalElement.present();
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.GOOGLE_MAPS_API_KEY}`
      )
      .pipe(
        map((geoData) => {
          console.log(geoData);
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.GOOGLE_MAPS_API_KEY}`;
  }
}
