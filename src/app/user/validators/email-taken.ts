import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) {}

  validate = (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return this.auth.fetchSignInMethodsForEmail(control.value).then(
      signInMethods => (signInMethods.length > 0 ? { emailIsTaken: true } : null)
    ).catch(() => null);  // Handle errors appropriately
  }
}

