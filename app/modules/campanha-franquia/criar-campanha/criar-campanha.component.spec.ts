import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCampanhaComponent } from './criar-campanha.component';

describe('CriarCampanhaComponent', () => {
  let component: CriarCampanhaComponent;
  let fixture: ComponentFixture<CriarCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
