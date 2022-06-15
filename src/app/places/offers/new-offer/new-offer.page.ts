import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/shared/location.model';
import { PlacesService } from '../../places.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
      image: new FormControl(null),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.listingForm.patchValue({ location: location });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;

    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      imageFile = imageData;
    }
    this.listingForm.patchValue({ image: imageFile });
  }

  onCreateListing() {
    if (!this.listingForm || !this.listingForm.get('image').value) {
      return;
    }
    console.log(this.listingForm.value);
    this.loadingController
      .create({
        message: 'Creating listing...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.placesService
          .uploadImage(this.listingForm.get('image').value)
          .pipe(
            switchMap((uploadResponse) => {
              return this.placesService.addListing(
                this.listingForm.value.title,
                this.listingForm.value.description,
                +this.listingForm.value.price,
                this.listingForm.value.dateFrom,
                this.listingForm.value.dateTo,
                this.listingForm.value.location,
                uploadResponse.imageUrl
              );
            })
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.listingForm.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
