import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVehiclePage } from './select-vehicle.page';

describe('SelectVehiclePage', () => {
  let component: SelectVehiclePage;
  let fixture: ComponentFixture<SelectVehiclePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVehiclePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
