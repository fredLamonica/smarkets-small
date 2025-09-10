import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotacaoItemComponent } from './cotacao-item.component';

describe('CotacaoItemComponent', () => {
  let component: CotacaoItemComponent;
  let fixture: ComponentFixture<CotacaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotacaoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotacaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
