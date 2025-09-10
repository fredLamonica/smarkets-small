import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeterminacaoVerbaComponent } from './upload-determinacao-verba.component';

describe('UploadDeterminacaoVerbaComponent', () => {
  let component: UploadDeterminacaoVerbaComponent;
  let fixture: ComponentFixture<UploadDeterminacaoVerbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadDeterminacaoVerbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDeterminacaoVerbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
