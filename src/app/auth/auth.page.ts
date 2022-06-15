import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Logging in...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        let authObservable: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObservable = this.authService.login(email, password);
        } else {
          authObservable = this.authService.signup(email, password);
        }
        authObservable.subscribe(
          (responseData) => {
            console.log(responseData);
            this.isLoading = false;
            loadingElement.dismiss();
            // this.router.navigate(['/places/tabs/discover']);
            this.router.navigateByUrl('/places/tabs/discover');
          },
          (errorResponse) => {
            // console.log(errorResponse.error.error.message)
            loadingElement.dismiss();
            const errorCode = errorResponse.error.error.message;
            let message = 'Could not sign up, please try again.';
            if (errorCode === 'EMAIL_EXISTS') {
              message = 'Email exists.';
            } else if (errorCode === 'EMAIL_NOT_FOUND') {
              message = 'Email address not found.';
            } else if (errorCode === 'INVALID_PASSWORD') {
              message = 'Incorrect password entered.';
            }
            this.showAlertError(message);
          }
        );
      });
    // this.router.navigateByUrl('/places/tabs/discover');
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmitAuth(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    this.authenticate(email, password);
    // this.router.navigate(['/places/tabs/discover']);
    form.reset();
  }

  private showAlertError(message: string) {
    this.alertController
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay'],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }
}
