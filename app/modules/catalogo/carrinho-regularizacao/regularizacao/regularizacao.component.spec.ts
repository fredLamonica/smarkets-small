import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegularizacaoComponent } from './regularizacao.component';

describe('RegularizacaoComponent', () => {
  let component: RegularizacaoComponent;
  let fixture: ComponentFixture<RegularizacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegularizacaoComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
