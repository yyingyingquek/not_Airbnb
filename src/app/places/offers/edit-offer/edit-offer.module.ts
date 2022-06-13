import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EditOfferPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditOfferPage],
})
export class EditOfferPageModule {}
