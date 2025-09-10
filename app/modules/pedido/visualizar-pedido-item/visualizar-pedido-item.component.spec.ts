import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPedidoItemComponent } from './visualizar-pedido-item.component';

describe('VisualizarPedidoItemComponent', () => {
    let component: VisualizarPedidoItemComponent;
    let fixture: ComponentFixture<VisualizarPedidoItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VisualizarPedidoItemComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VisualizarPedidoItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
