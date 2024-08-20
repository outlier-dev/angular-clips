import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import IUser from "../models/user.model";
import {Observable, of} from "rxjs";
import {map, delay, filter, switchMap} from "rxjs/operators";
import {Router} from "@angular/router";
import { ActivatedRoute, NavigationEnd } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWidthDelay$: Observable<boolean>
  public redirect= false;
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private route:ActivatedRoute
  ) {
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
      map( user => !!user)
    );
    this.isAuthenticatedWidthDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
    this.router.events.pipe(
      filter( e => e instanceof NavigationEnd),
      map( e => this.route.firstChild),
      switchMap( route => route?.data ?? of({authOnly: false}))
    ).subscribe((data)=>{this.redirect = data.authOnly ?? false})
  }

  public async createUser( userData: IUser ){
    if (!userData.password){
      throw new Error("Password not provided!")
    }

    const {email, password, name, age, phoneNumber} = userData;

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )

    if (!userCred.user){
      throw new Error("User can't be found!")
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: name,
      age: age,
      email: email,
      phoneNumber: phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: name
    })
  }

  public async logOut($event?: Event){
    if ($event){
      $event.preventDefault();
    }
    try {
      await this.auth.signOut();
      if (this.redirect){
        await this.router.navigateByUrl('/');
      }
    }
    catch (e){
      throw new Error("Sorry, we can't log you out yet.");
    }
  }
}
