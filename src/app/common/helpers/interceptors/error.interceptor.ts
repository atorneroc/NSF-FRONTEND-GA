import { HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../shared/services/alert.service';

@Injectable({
    providedIn: 'root'
})

export class ErrorInterceptorService {

    constructor(
        private _alertService: AlertService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(

            catchError((response: HttpErrorResponse) => {

                let message = ''

                if (response.status !== 204 && response.status !== 0 && response.error) {

                    if (response.error.Message != null)
                    {
                        message = response.error.Message
                    }else {
                        message =response.error.Error[0]
                    }
                    this._alertService.error(message)
                }

                return throwError(() => response);
            })
        );
    }
}
