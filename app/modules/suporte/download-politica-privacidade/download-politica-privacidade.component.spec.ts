import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPoliticaPrivacidadeComponent } from './download-politica-privacidade.component';

describe('DownloadPoliticaPrivacidadeComponent', () => {
  let component: DownloadPoliticaPrivacidadeComponent;
  let fixture: ComponentFixture<DownloadPoliticaPrivacidadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPoliticaPrivacidadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPoliticaPrivacidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
