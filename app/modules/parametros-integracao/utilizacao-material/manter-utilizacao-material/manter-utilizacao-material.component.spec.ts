import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterUtilizacaoMaterialComponent } from './manter-utilizacao-material.component';

describe('ManterUtilizacaoMaterialComponent', () => {
  let component: ManterUtilizacaoMaterialComponent;
  let fixture: ComponentFixture<ManterUtilizacaoMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterUtilizacaoMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterUtilizacaoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
