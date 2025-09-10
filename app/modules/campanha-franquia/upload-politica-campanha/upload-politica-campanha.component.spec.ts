import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPoliticaCampanhaComponent } from './upload-politica-campanha.component';

describe('UploadPoliticaCampanhaComponent', () => {
  let component: UploadPoliticaCampanhaComponent;
  let fixture: ComponentFixture<UploadPoliticaCampanhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPoliticaCampanhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPoliticaCampanhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
