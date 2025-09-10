import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListSupplyCathegoryComponent } from './list-supply-cathegory.component';

describe('ListSupplyCathegoryComponent', () => {
  let component: ListSupplyCathegoryComponent;
  let fixture: ComponentFixture<ListSupplyCathegoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSupplyCathegoryComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSupplyCathegoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
