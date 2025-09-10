import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEnderecosComponent } from './input-enderecos.component';

describe('InputEnderecosComponent', () => {
  let component: InputEnderecosComponent;
  let fixture: ComponentFixture<InputEnderecosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputEnderecosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEnderecosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
