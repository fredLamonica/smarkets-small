import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUtilizacaoMaterialComponent } from './listar-utilizacao-material.component';

describe('ListarUtilizacaoMaterialComponent', () => {
  let component: ListarUtilizacaoMaterialComponent;
  let fixture: ComponentFixture<ListarUtilizacaoMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarUtilizacaoMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarUtilizacaoMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
