import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { PlaceLocation } from '../../location.model';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPicked = new EventEmitter<PlaceLocation>()
  selectedLocationImage: string;
  isLoading: boolean = false;

  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalController
      .create({ component: MapModalComponent })
      .then((modalElement) => {
        modalElement.onDidDismiss().then((modalData) => {
          console.log(modalData.data);
          if (!modalData.data) {
            return;
          }
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.isLoading = true;
          this.getAddress(modalData.data.lat, modalData.data.lng)
            .pipe(
              switchMap((address) => {
                pickedLocation.address = address;
                return of(
                  this.getMagImage(pickedLocation.lat, pickedLocation.lng, 14)
                );
              })
            )
            .subscribe((staticMapUrl) => {
              pickedLocation.staticMapImageUrl = staticMapUrl;
              this.selectedLocationImage = staticMapUrl;
              this.isLoading = false;
              this.locationPicked.emit(pickedLocation)
            });
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

  private getMagImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.GOOGLE_MAPS_API_KEY}`;
  }
}
