import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TranslationLibraryService } from '../providers';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {

  constructor(private toastr: ToastrService, private translationLibrary: TranslationLibraryService) { }

  treatError(error: HttpErrorResponse): void {
    if (error && error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        if (error.error) {
          if (error.error instanceof Array) {
            const message = new Array<string>();
            message.push('<ul>');
            message.push(...error.error.map((x) => `<li>${x.message}</li>`));
            message.push('</ul>');

            this.toastr.error(message.join(''), 'INCONSISTÊNCIAS:', { enableHtml: true });
          } else {
            this.toastr.error(error.error);
          }
        } else {
          this.toastrGenericError();
        }
      } else {
        this.toastrGenericError();
      }
    } else {
      this.toastrGenericError();
    }
  }

  parseErrorBlob(errorResponse: HttpErrorResponse): Observable<HttpErrorResponse> {
    const reader: FileReader = new FileReader();
    const isBlobError: boolean = errorResponse.error instanceof Blob && errorResponse.error.type === 'application/json';

    const httpErrorResponseObservable = new Observable<HttpErrorResponse>((observer: any) => {
      if (isBlobError) {
        reader.onloadend = () => {
          observer.error(new HttpErrorResponse({ ...errorResponse, error: JSON.parse(reader.result as string) }));
          observer.complete();
        };
      } else {
        observer.error(errorResponse);
        observer.complete();
      }
    });

    if (isBlobError) {
      reader.readAsText(errorResponse.error);
    }

    return httpErrorResponseObservable;
  }

  private toastrGenericError(): void {
    this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
  }
}
