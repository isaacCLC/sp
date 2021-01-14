import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentScene3Page } from './accident-scene3.page';

describe('AccidentScene3Page', () => {
  let component: AccidentScene3Page;
  let fixture: ComponentFixture<AccidentScene3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentScene3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentScene3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
