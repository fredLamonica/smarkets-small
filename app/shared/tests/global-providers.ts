import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, TranslateCompiler, TranslateLoader, TranslateParser, TranslateService, TranslateStore, USE_DEFAULT_LANG, USE_STORE } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BlockUIInstanceService } from 'ng-block-ui/lib/services/block-ui-instance.service';
import { ToastrService } from 'ngx-toastr';
import { AutenticacaoService, LocalStorageService, MaskService, TranslationLibraryService } from '../providers';

export const globalProviders = [
  TranslationLibraryService,
  BlockUIInstanceService,
  TranslateService,
  TranslateStore,
  {
    provide: TranslateLoader,
    useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/', '.json'),
    deps: [HttpClient],
  },
  TranslateCompiler,
  TranslateParser,
  MissingTranslationHandler,
  { provide: USE_DEFAULT_LANG },
  { provide: USE_STORE },
  ToastrService,
  AutenticacaoService,
  LocalStorageService,
  MaskService,
  DecimalPipe,
  CurrencyPipe,
];
