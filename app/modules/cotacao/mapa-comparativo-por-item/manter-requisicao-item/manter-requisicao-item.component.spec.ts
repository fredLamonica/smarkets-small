import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterRequisicaoItemComponent } from './manter-requisicao-item.component';

describe('ManterRequisicaoItemComponent', () => {
  let component: ManterRequisicaoItemComponent;
  let fixture: ComponentFixture<ManterRequisicaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterRequisicaoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterRequisicaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
