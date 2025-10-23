import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './common/shared/shared.module';
import { AuthModule } from './presentation/auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataModule } from './data/data.module';
import { CoreModule } from './core/core.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptorService } from './common/helpers/interceptors/loader.interceptor';
import { ErrorInterceptorService } from './common/helpers/interceptors/error.interceptor';
import { MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { AD_URL } from './common/helpers/constants/url.constants';
import { configurePrimeNGTranslation } from './common/helpers/config/primeNG.config';

export function MsalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth:  {
      clientId: '1c29002c-db32-4f68-8221-7c939ca362ce',
      authority: 'https://login.microsoftonline.com/d3acff10-5531-465c-b3fd-9186f2fab5cf',
      redirectUri: AD_URL //'https://nsf-frontend-dev.azurewebsites.net/'
    },cache: {
      cacheLocation: 'localStorage', // or 'sessionStorage'
      storeAuthStateInCookie: false,
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read', 'mail.read']);
  //protectedResourceMap.set('http://localhost:8080/hello', ['api://d16e1a06-3be2-4ae1-8bd4-718c19cecac3/hello']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    SharedModule,
    AuthModule,

    DataModule,
    CoreModule,

    MsalModule,

    HttpClientModule

  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MsalInstanceFactory},
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configurePrimeNGTranslation,
      deps: [PrimeNGConfig],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
