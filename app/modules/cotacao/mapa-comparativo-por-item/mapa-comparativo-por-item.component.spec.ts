import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaComparativoPorItemComponent } from './mapa-comparativo-por-item.component';

describe('MapaComparativoPorItemComponent', () => {
  let component: MapaComparativoPorItemComponent;
  let fixture: ComponentFixture<MapaComparativoPorItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaComparativoPorItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaComparativoPorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
