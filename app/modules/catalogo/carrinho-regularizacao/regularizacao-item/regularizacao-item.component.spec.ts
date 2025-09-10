import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegularizacaoItemComponent } from './regularizacao-item.component';

describe('RegularizacaoItemComponent', () => {
  let component: RegularizacaoItemComponent;
  let fixture: ComponentFixture<RegularizacaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegularizacaoItemComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularizacaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
