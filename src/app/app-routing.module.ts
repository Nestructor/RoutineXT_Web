import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaNoEncontradaComponent } from './page-not-found/pagina-no-encontrada.component';
import { AccountComponent } from './unregistered/account/account.component';
import { CookiePolicyComponent } from './unregistered/cookie-policy/cookie-policy.component';
import { FaqsContactComponent } from './unregistered/faqs-contact/faqs-contact.component';
import { HomeComponent } from './unregistered/home/home.component';
import { LegalNoticeComponent } from './unregistered/legal-notice/legal-notice.component';
import { LoginComponent } from './unregistered/login/login.component';
import { PrivacyPolicyComponent } from './unregistered/privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './unregistered/reset-password/reset-password.component';
import { TrainingPlanComponent } from './registered/training-plan/training-plan.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "Iniciar_Sesion", component: LoginComponent
  },
  {
    path: "Crear_Cuenta", component: AccountComponent
  },
  {
    path: "Política_De_Privacidad", component: PrivacyPolicyComponent
  },
  {
    path: "Política_De_Cookies", component: CookiePolicyComponent
  },
  {
    path: "Aviso_Legal", component: LegalNoticeComponent
  },
  {
    path: "Plan_De_Entrenamiento", component: TrainingPlanComponent
  },
  {
    path: "FAQs_Contacto", component: FaqsContactComponent
  },
  {
    path: "Nueva_Contraseña", component: ResetPasswordComponent
  },
  {
    path: '**', component: PaginaNoEncontradaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
