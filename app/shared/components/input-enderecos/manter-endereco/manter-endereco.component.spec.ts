import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterEnderecoComponent } from './manter-endereco.component';

describe('ManterEnderecoComponent', () => {
  let component: ManterEnderecoComponent;
  let fixture: ComponentFixture<ManterEnderecoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterEnderecoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterEnderecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
