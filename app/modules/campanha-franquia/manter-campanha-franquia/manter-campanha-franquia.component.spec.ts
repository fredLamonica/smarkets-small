import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCampanhaFranquiaComponent } from './manter-campanha-franquia.component';

describe('ManterCampanhaFranquiaComponent', () => {
  let component: ManterCampanhaFranquiaComponent;
  let fixture: ComponentFixture<ManterCampanhaFranquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCampanhaFranquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCampanhaFranquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
