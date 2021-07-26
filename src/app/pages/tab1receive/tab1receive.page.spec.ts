import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab1receivePage } from './tab1receive.page';

describe('Tab1receivePage', () => {
  let component: Tab1receivePage;
  let fixture: ComponentFixture<Tab1receivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab1receivePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1receivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
