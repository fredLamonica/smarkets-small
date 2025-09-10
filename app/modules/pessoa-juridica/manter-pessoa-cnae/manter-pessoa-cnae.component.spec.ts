import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterPessoaCnaeComponent } from './manter-pessoa-cnae.component';

describe('ManterPessoaCnaeComponent', () => {
  let component: ManterPessoaCnaeComponent;
  let fixture: ComponentFixture<ManterPessoaCnaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterPessoaCnaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterPessoaCnaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
