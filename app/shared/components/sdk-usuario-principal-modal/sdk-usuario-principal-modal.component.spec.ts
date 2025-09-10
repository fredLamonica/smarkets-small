import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkUsuarioPrincipalModalComponent } from './sdk-usuario-principal-modal.component';

describe('SdkUsuarioPrincipalModalComponent', () => {
  let component: SdkUsuarioPrincipalModalComponent;
  let fixture: ComponentFixture<SdkUsuarioPrincipalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkUsuarioPrincipalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkUsuarioPrincipalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
