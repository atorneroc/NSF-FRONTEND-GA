import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, throwError, EMPTY } from "rxjs";
import { catchError, mergeMap,finalize } from "rxjs/operators";
import { MsalService } from "@azure/msal-angular"; // Import the necessary MSAL service
import { LoaderService } from "../../shared/components/loader/loader.service";
import { AlertService } from "../../shared/services/alert.service";

import { Router } from "@angular/router";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

@Injectable({
    providedIn: 'root'
})
export class LoaderInterceptorService implements HttpInterceptor {

    constructor(
        private _msalService: MsalService,
        private _loaderService: LoaderService,
        private _alertService: AlertService,
        private router: Router,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this._loaderService.open();
        const activeAccount = this._msalService.instance.getActiveAccount();//obtiene la cuenta activa para poder usarlo en el tokenSilent

        if (!activeAccount) {
            // Si no hay cuenta activa, forzamos al usuario a iniciar sesión nuevamente
            this._msalService.logoutRedirect({
                postLogoutRedirectUri: "/login" // Opcional: Redirige al inicio de sesión
            });
            this._loaderService.close();
            return EMPTY; // Detenemos el flujo del interceptor
        }
    
        return from(this._msalService.acquireTokenSilent({
            scopes: ["user.read"],
            account: activeAccount
        })).pipe(
            catchError((error) => {
                if (error instanceof InteractionRequiredAuthError) {
                    // Token no se puede renovar silenciosamente, forzamos cierre de sesión
                    this._msalService.logoutRedirect({
                        postLogoutRedirectUri: "/login" // Opcional: Redirige al inicio de sesión
                    });
                    return EMPTY; // Detenemos el flujo del interceptor
                } else {
                    console.error("Error inesperado al renovar el token:", error);
                    return throwError(() => error); // Re-lanzamos el error para manejarlo en otro lugar
                }
            }),
            mergeMap((authResponse) => {
                const tkn = authResponse.accessToken;
                localStorage.setItem('token',tkn)
                if (tkn) {
                    req = req.clone({
                        setHeaders: {
                            authorization: `Bearer ${tkn}`
                        }
                    });
                }

                return next.handle(req).pipe(
                    catchError((error) => {
                        if (error.status === 401) {
                            // Si recibimos un 401, significa que el token ya no es válido
                            this._alertService.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                            this._msalService.logoutRedirect({
                                postLogoutRedirectUri: "/login" // Opcional: Redirige al inicio de sesión
                            });
                        }
                        return throwError(() => error); // Re-lanzamos el error para manejarlo en otro lugar
                    })
                );
            }),
            finalize(() => this._loaderService.close())
        );
    }
}
