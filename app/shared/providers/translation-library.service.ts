import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslationLibraryService {

  public translations: any = {};

  constructor(private translate: TranslateService) { }

  public subscribeLanguageChange() {
    this.translate.onLangChange.subscribe(
      language => {
        this.getTranslations(language);
      }
    );
  }

  private async getTranslations(language: any) {
    this.translations = language.translations;
  }
}
