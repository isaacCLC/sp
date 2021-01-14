import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTelNumberPage } from './select-tel-number.page';

describe('SelectTelNumberPage', () => {
  let component: SelectTelNumberPage;
  let fixture: ComponentFixture<SelectTelNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTelNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTelNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
