import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs'
import { NavComponent } from './nav.component';
import {AuthService} from "../services/auth.service";
import {AppRoutingModule} from "../app-routing.module";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";
import {TabsContainerComponent} from "../shared/tabs-container/tabs-container.component";

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  const mockedAuthService = jasmine.createSpyObj('AuthService',[
    'createUser', 'logOut'
  ],{isAuthenticated$: of(true)})

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports:[RouterTestingModule],
      providers:[
        {provide: AuthService, useValue: mockedAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(4) a'));
    expect(logoutLink).withContext('Not logged in').toBeTruthy();
    logoutLink.triggerEventHandler('click');

    const service = TestBed.inject(AuthService)

    expect(service.logOut).withContext('could not click logout link').toHaveBeenCalledTimes(1);
  });
});
