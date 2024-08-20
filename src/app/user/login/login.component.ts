import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {
    email: '',
    password:''
  }

  showAlert = false
  alertMsg = 'Please wait! System trying to log you in.';
  alertColor = 'blue';
  inSubmission = false

  constructor( private auth: AngularFireAuth) {
  }
  async login(){
    this.showAlert = true;
    this.inSubmission = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
    }
    catch (error){
      console.log(error);
      this.alertMsg = 'Something goes wrong';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'You successfully logged in!';
    this.alertColor = 'green';

  }
}
