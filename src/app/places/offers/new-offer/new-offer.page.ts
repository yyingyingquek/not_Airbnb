import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/shared/location.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  listingForm: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.listingForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.listingForm.patchValue({ location: location });
  }

  onCreateListing() {
    if (!this.listingForm) {
      return;
    }
    console.log(this.listingForm);
    this.loadingController
      .create({
        message: 'Creating listing...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.placesService
          .addListing(
            this.listingForm.value.title,
            this.listingForm.value.description,
            +this.listingForm.value.price,
            this.listingForm.value.dateFrom,
            this.listingForm.value.dateTo,
            this.listingForm.value.location
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.listingForm.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
