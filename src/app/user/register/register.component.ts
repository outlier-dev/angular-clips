import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import IUser from "../../models/user.model";
import {RegisterValidators} from "../validators/register-validators";
import {EmailTaken} from "../validators/email-taken";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
  ) {}

  inSubmission = false;

  name= new FormControl('', [Validators.pattern('[a-zA-Z ]*'), Validators.required, Validators.minLength(3)]);
  email= new FormControl(
    '',
    [Validators.email,Validators.required],
    [this.emailTaken.validate]
  );
  age= new FormControl<number | null>(null,[Validators.required, Validators.min(16),Validators.max(120)]);
  password= new FormControl('',[Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]);
  confirm_password= new FormControl('',[Validators.required]);
  phoneNumber= new FormControl('',[Validators.required,Validators.minLength(13), Validators.maxLength(13)]);

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created';
  alertColor = 'blue';

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  },[RegisterValidators.match('password','confirm_password')]);

  async register(){
    this.showAlert = true;
    this.inSubmission = true;
    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    }
    catch (error){
      console.log(error);
      this.alertMsg = 'Something goes wrong';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'Your account is successfully created!';
    this.alertColor = 'green';
  }


}
