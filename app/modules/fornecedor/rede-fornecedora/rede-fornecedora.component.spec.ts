import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeFornecedoraComponent } from './rede-fornecedora.component';

describe('RedeFornecedoraComponent', () => {
  let component: RedeFornecedoraComponent;
  let fixture: ComponentFixture<RedeFornecedoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeFornecedoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeFornecedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
