import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalContentPage } from './additional-content.page';

describe('AdditionalContentPage', () => {
  let component: AdditionalContentPage;
  let fixture: ComponentFixture<AdditionalContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalContentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
