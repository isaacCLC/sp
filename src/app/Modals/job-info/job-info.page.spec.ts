import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInfoPage } from './job-info.page';

describe('JobInfoPage', () => {
  let component: JobInfoPage;
  let fixture: ComponentFixture<JobInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
