import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicaoItemComponent } from './requisicao-item.component';

describe('RequisicaoItemComponent', () => {
  let component: RequisicaoItemComponent;
  let fixture: ComponentFixture<RequisicaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisicaoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisicaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
