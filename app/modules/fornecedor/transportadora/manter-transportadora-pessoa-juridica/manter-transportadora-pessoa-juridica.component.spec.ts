import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterTransportadoraPessoaJuridicaComponent } from './manter-transportadora-pessoa-juridica.component';

describe('ManterTransportadoraPessoaJuridicaComponent', () => {
  let component: ManterTransportadoraPessoaJuridicaComponent;
  let fixture: ComponentFixture<ManterTransportadoraPessoaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterTransportadoraPessoaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterTransportadoraPessoaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
