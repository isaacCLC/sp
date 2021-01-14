import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescModalPage } from './job-desc-modal.page';

describe('JobDescModalPage', () => {
  let component: JobDescModalPage;
  let fixture: ComponentFixture<JobDescModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDescModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
