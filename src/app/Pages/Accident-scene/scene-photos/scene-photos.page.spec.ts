import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenePhotosPage } from './scene-photos.page';

describe('ScenePhotosPage', () => {
  let component: ScenePhotosPage;
  let fixture: ComponentFixture<ScenePhotosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenePhotosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenePhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
