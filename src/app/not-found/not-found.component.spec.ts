import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFOundComponent } from './not-found.component';

describe('NotFOundComponent', () => {
  let component: NotFOundComponent;
  let fixture: ComponentFixture<NotFOundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFOundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotFOundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
