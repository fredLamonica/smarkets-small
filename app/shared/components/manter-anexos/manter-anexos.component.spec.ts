import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManterAnexosComponent } from './manter-anexos.component';

describe('ManterAnexosComponent', () => {
  let component: ManterAnexosComponent;
  let fixture: ComponentFixture<ManterAnexosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManterAnexosComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
