import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemDocumentoEnviarComponent } from './item-documento.component';

describe('ItemDocumentoComponent', () => {
  let component: ItemDocumentoEnviarComponent;
  let fixture: ComponentFixture<ItemDocumentoEnviarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemDocumentoEnviarComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDocumentoEnviarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
