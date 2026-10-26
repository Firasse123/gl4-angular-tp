import { provideZoneChangeDetection, isDevMode, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AuthInterceptorProvider } from "./app/auth/interceptors/auth.interceptor";
import { provideHttpClient, withXhr, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { ServiceWorkerModule } from "@angular/service-worker";
import { AppComponent } from "./app/app.component";


bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideRouter(routes),
        importProvidersFrom(BrowserModule, FormsModule, BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule, ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        })),
        AuthInterceptorProvider,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ]
})
  .catch(err => console.error(err));
