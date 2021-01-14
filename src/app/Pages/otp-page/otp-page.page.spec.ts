import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPagePage } from './otp-page.page';

describe('OtpPagePage', () => {
  let component: OtpPagePage;
  let fixture: ComponentFixture<OtpPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
