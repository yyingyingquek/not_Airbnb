import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  editForm: FormGroup;
  isLoading: boolean = false;
  private placeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navController: NavController,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSubscription = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          (place) => {
            this.place = place;
            this.editForm = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertController
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertElement) => {
                alertElement.present();
              });
          }
        );
    });
  }

  onUpdateListing() {
    if (!this.editForm) {
      return;
    }
    this.loadingController
      .create({
        message: 'Updating...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.placesService
          .updateListing(
            this.place.id,
            this.editForm.value.title,
            this.editForm.value.description
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.editForm.reset();
            this.router.navigate(['places/tabs/offers']);
          });
      });
  }

  ngOnDestroy(): void {
    if (this.placeSubscription) {
      this.placeSubscription.unsubscribe();
    }
  }
}
