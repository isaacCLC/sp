import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheInsuredPage } from './the-insured.page';

describe('TheInsuredPage', () => {
  let component: TheInsuredPage;
  let fixture: ComponentFixture<TheInsuredPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheInsuredPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheInsuredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
