import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificacaoSignalRComponent } from './notificacao-signalr.component';


describe('NotificacaoComponent', () => {
  let component: NotificacaoSignalRComponent;
  let fixture: ComponentFixture<NotificacaoSignalRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificacaoSignalRComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacaoSignalRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
