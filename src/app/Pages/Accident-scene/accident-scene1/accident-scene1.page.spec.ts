import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentScene1Page } from './accident-scene1.page';

describe('AccidentScene1Page', () => {
  let component: AccidentScene1Page;
  let fixture: ComponentFixture<AccidentScene1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentScene1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentScene1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
