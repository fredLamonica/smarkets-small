import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterEnderecoModalComponent } from './manter-endereco-modal.component';

describe('ManterEnderecoModalComponent', () => {
  let component: ManterEnderecoModalComponent;
  let fixture: ComponentFixture<ManterEnderecoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterEnderecoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterEnderecoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
