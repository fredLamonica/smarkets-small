import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterBancoComponent } from './manter-banco.component';

describe('ManterBancoComponent', () => {
  let component: ManterBancoComponent;
  let fixture: ComponentFixture<ManterBancoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterBancoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
