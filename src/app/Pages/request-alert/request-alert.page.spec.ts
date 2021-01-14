import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAlertPage } from './request-alert.page';

describe('RequestAlertPage', () => {
  let component: RequestAlertPage;
  let fixture: ComponentFixture<RequestAlertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestAlertPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
