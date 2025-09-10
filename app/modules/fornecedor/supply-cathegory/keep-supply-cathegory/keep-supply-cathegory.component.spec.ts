import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepSupplyCathegoryComponent } from './keep-supply-cathegory.component';

describe('ManterCategoriaFornecimentoComponent', () => {
  let component: KeepSupplyCathegoryComponent;
  let fixture: ComponentFixture<KeepSupplyCathegoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeepSupplyCathegoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepSupplyCathegoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
