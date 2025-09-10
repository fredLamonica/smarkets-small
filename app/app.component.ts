import { Component } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalyticsService, TranslationLibraryService } from '@shared/providers';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private translationLibrary: TranslationLibraryService,
    private config: NgSelectConfig,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.config.notFoundText = 'Nenhum registro encontrado';
    this.subscribeLanguageChange();
    this.startInternationalization();

    if (environment.production) {
      this.googleAnalyticsService.loadGoogleAnalytics();
    }
  }

  // #region Starting Internationalization
  private subscribeLanguageChange() {
    this.translationLibrary.subscribeLanguageChange();
  }

  private startInternationalization() {
    this.translate.addLangs(['pt-br', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.getBrowserLanguage());
  }

  private getBrowserLanguage(): string {
    // let browserLang = this.translate.getBrowserLang();

    // if(browserLang.match(/pt|pt-br/))
    //   return 'pt-br';

    // return 'en'
    return 'pt-br';
  }
  // #endregion
}
