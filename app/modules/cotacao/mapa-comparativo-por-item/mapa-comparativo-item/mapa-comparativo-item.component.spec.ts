import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaComparativoItemComponent } from './mapa-comparativo-item.component';

describe('MapaComparativoItemComponent', () => {
  let component: MapaComparativoItemComponent;
  let fixture: ComponentFixture<MapaComparativoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaComparativoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaComparativoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
