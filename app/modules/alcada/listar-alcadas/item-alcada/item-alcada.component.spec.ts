import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemAlcadaComponent } from './item-alcada.component';

describe('ItemAlcadaAprovacaoComponent', () => {
  let component: ItemAlcadaComponent;
  let fixture: ComponentFixture<ItemAlcadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemAlcadaComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAlcadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
