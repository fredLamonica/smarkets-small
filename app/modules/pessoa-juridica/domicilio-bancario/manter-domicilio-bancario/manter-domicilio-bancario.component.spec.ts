import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManterDomicilioBancarioComponent } from './manter-domicilio-bancario.component';

describe('ManterDomicilioBancarioComponent', () => {
  let component: ManterDomicilioBancarioComponent;
  let fixture: ComponentFixture<ManterDomicilioBancarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManterDomicilioBancarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManterDomicilioBancarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
