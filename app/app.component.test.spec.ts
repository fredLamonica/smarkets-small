import { async, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { globalImports } from './shared/tests/global-imports';
import { globalProviders } from './shared/tests/global-providers';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [...globalProviders],
      imports: [...globalImports],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have a not found text for ng-select 'Nenhum registro encontrado'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.config.notFoundText).toEqual('Nenhum registro encontrado');
  }));
});
