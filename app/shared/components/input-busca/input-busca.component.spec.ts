import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBuscaComponent } from './input-busca.component';

describe('InputBuscaComponent', () => {
  let component: InputBuscaComponent;
  let fixture: ComponentFixture<InputBuscaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputBuscaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputBuscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
