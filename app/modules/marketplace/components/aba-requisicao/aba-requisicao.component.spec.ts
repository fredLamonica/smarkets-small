import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbaRequisicaoComponent } from './aba-requisicao.component';

describe('AbaRequisicaoComponent', () => {
  let component: AbaRequisicaoComponent;
  let fixture: ComponentFixture<AbaRequisicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbaRequisicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbaRequisicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
