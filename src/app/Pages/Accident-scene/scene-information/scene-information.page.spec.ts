import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneInformationPage } from './scene-information.page';

describe('SceneInformationPage', () => {
  let component: SceneInformationPage;
  let fixture: ComponentFixture<SceneInformationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneInformationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
