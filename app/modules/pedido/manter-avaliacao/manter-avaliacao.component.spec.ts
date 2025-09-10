import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterAvaliacaoComponent } from './manter-avaliacao.component';

describe('ManterAvaliacaoComponent', () => {
  let component: ManterAvaliacaoComponent;
  let fixture: ComponentFixture<ManterAvaliacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterAvaliacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
