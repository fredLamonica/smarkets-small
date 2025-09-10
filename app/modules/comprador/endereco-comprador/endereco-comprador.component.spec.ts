import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoCompradorComponent } from './endereco-comprador.component';

describe('EnderecoCompradorComponent', () => {
  let component: EnderecoCompradorComponent;
  let fixture: ComponentFixture<EnderecoCompradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnderecoCompradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnderecoCompradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
