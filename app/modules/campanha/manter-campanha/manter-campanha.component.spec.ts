import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterCampanhaComponent } from './manter-campanha.component';

describe('ManterCampanhaComponent', () => {
  let component: ManterCampanhaComponent;
  let fixture: ComponentFixture<ManterCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
