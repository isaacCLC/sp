import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNumberOtpPage } from './add-number-otp.page';

describe('AddNumberOtpPage', () => {
  let component: AddNumberOtpPage;
  let fixture: ComponentFixture<AddNumberOtpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNumberOtpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNumberOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
