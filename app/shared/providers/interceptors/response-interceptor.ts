import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import { ToastrService } from 'ngx-toastr';
import { BlockUI } from '../../../../../node_modules/ng-block-ui/lib/decorators/block-ui.decorator';
import { NgBlockUI } from '../../../../../node_modules/ng-block-ui/lib/models/block-ui.model';
import { finalize, map } from '../../../../../node_modules/rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    @BlockUI() blockUI: NgBlockUI;

    constructor(private toastr: ToastrService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                map(resp => {
                    return resp;
                })
            ).catch(err => {
                if (err instanceof HttpErrorResponse ) {
                    this.toastr.error(err.error.message);
                    // if (this.blockUI.isActive)
                    //     this.blockUI.stop();
                }
                return Observable.of(err);
            });
    }
}  