import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { TranslationLibraryService } from '../providers';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  constructor(private toastrService: ToastrService, private translationLibraryService: TranslationLibraryService) { }

  loggedUserHasPermission(permissionConditionMet: () => boolean): Observable<boolean> {
    return new Observable<boolean>((subscriber: Subscriber<boolean>) => {
      if (permissionConditionMet()) {
        subscriber.next(true);
      } else {
        this.toastrService.warning(this.translationLibraryService.translations.ALERTS.PERMISSION_DENIED, `${this.translationLibraryService.translations.ALERTS.ATTENTION.toUpperCase()}!`);
        subscriber.next(false);
      }

      subscriber.complete();
    });
  }
}
