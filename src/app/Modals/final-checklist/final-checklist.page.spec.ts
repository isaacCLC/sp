import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalChecklistPage } from './final-checklist.page';

describe('FinalChecklistPage', () => {
  let component: FinalChecklistPage;
  let fixture: ComponentFixture<FinalChecklistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalChecklistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalChecklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
