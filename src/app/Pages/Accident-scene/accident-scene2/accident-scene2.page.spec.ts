import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentScene2Page } from './accident-scene2.page';

describe('AccidentScene2Page', () => {
  let component: AccidentScene2Page;
  let fixture: ComponentFixture<AccidentScene2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentScene2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentScene2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
