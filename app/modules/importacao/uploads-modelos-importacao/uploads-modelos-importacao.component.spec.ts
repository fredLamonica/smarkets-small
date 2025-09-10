import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadsModelosImportacaoComponent } from './uploads-modelos-importacao.component';

describe('UploadsModelosImportacaoComponent', () => {
  let component: UploadsModelosImportacaoComponent;
  let fixture: ComponentFixture<UploadsModelosImportacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadsModelosImportacaoComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsModelosImportacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
