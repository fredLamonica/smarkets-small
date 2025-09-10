import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCampanhaFranquiaComponent } from './item-campanha-franquia.component';

describe('ItemCampanhaFranquiaComponent', () => {
  let component: ItemCampanhaFranquiaComponent;
  let fixture: ComponentFixture<ItemCampanhaFranquiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCampanhaFranquiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCampanhaFranquiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
