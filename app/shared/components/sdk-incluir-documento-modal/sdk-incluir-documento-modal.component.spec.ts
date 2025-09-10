import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkIncluirDocumentoModalComponent } from './sdk-incluir-documento-modal.component';

describe('SdkIncluirDocumentoModalComponent', () => {
  let component: SdkIncluirDocumentoModalComponent;
  let fixture: ComponentFixture<SdkIncluirDocumentoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkIncluirDocumentoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkIncluirDocumentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
