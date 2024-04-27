import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { AgmCoreModule } from "@agm/core";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DragulaService } from "ng2-dragula";
import { NgxSpinnerModule } from "ngx-spinner";

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
// import * as fromApp from './store/app.reducer';
import { AppComponent } from "./app.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthGuard } from "./shared/auth/auth-guard.service";
import { WINDOW_PROVIDERS } from "./shared/services/window.service";
import { CreateNewCustomerComponent } from "./create-new-customer/create-new-customer.component";
import { AuthInterceptor } from "./http.interceptor";
import { CreateNewLoanComponent } from "./create-new-loan/create-new-loan.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateNewUserComponent } from "./create-new-user/create-new-user.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { GobackbuttonComponent } from "./gobackbutton/gobackbutton.component";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    ContentLayoutComponent,

    //create
    CreateNewCustomerComponent,
    CreateNewLoanComponent,
    CreateNewUserComponent,

    // MyPaginationComponent,
    // CustomerDetailsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    // StoreModule.forRoot(fromApp.appReducer),
    NgSelectModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCERobClkCv1U4mDijGm1FShKva_nxsGJY",
    }),
    PerfectScrollbarModule,
  ],
  providers: [
    AuthGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DragulaService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    WINDOW_PROVIDERS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
