import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleChecklistPage } from './vehicle-checklist.page';

describe('VehicleChecklistPage', () => {
  let component: VehicleChecklistPage;
  let fixture: ComponentFixture<VehicleChecklistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleChecklistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
