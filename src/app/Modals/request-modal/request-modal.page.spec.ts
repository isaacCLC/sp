import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestModalPage } from './request-modal.page';

describe('RequestModalPage', () => {
  let component: RequestModalPage;
  let fixture: ComponentFixture<RequestModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
