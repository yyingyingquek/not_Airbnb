import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('bookingForm', { static: true }) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();
    }

    this.endDate = new Date(
      new Date(this.startDate).getTime() +
        Math.random() *
          (new Date(this.startDate).getTime() +
            6 * 24 * 60 * 60 * 1000 -
            new Date(this.startDate).getTime())
    ).toISOString();
  }

  // new Date(this.startDate).getTime() +
  //       Math.random() *
  //         (new Date(this.startDate).getTime() +
  //           6 * 24 * 60 * 60 * 1000 -
  //           new Date(this.startDate).getTime())

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onBookPlace() {
    this.modalController.dismiss(
      {
        message: 'message',
        dismissed: true,
      },
      'confirm'
    );
  }

  onSubmitBookingForm() {}

  datesValid() {
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);

    return endDate > startDate;
  }
}
