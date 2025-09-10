import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCentroCustoComponent } from './manter-centro-custo.component';

describe('ManterCentroCustoComponent', () => {
  let component: ManterCentroCustoComponent;
  let fixture: ComponentFixture<ManterCentroCustoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCentroCustoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
