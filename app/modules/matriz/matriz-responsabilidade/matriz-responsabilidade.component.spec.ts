import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrizResponsabilidadeComponent } from './matriz-responsabilidade.component';

describe('MatrizResponsabilidadeComponent', () => {
  let component: MatrizResponsabilidadeComponent;
  let fixture: ComponentFixture<MatrizResponsabilidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrizResponsabilidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrizResponsabilidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
