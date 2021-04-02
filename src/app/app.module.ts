import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire'; //Inicializar conexión con Firebase
import { AngularFireAuthModule } from '@angular/fire/auth'; //Para trabajar con Autenticaciones
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { HomeComponent } from './unregistered/home/home.component';
import { LoginComponent } from './unregistered/login/login.component';
import { AccountComponent } from './unregistered/account/account.component';
import { AuthService } from './services/auth.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { FooterComponent } from './unregistered/footer/footer.component';
import { CookiePolicyComponent } from './unregistered/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './unregistered/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './unregistered/legal-notice/legal-notice.component';
import { FaqsContactComponent } from './unregistered/faqs-contact/faqs-contact.component';
import { ResetPasswordComponent } from './unregistered/reset-password/reset-password.component';
import { PaginaNoEncontradaComponent } from './page-not-found/pagina-no-encontrada.component';
import { TrainingPlanComponent } from './registered/training-plan/training-plan.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    FooterComponent,
    CookiePolicyComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    FaqsContactComponent,
    ResetPasswordComponent,
    PaginaNoEncontradaComponent,
    TrainingPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccordionModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    NgbModule,
    FormsModule
  ],
  providers: [
    AngularFireAuth,
    AuthService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
