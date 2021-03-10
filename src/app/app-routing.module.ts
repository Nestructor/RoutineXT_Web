import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './unregistered/account/account.component';
import { CookiePolicyComponent } from './unregistered/cookie-policy/cookie-policy.component';
import { HomeComponent } from './unregistered/home/home.component';
import { LegalNoticeComponent } from './unregistered/legal-notice/legal-notice.component';
import { LoginComponent } from './unregistered/login/login.component';
import { PrivacyPolicyComponent } from './unregistered/privacy-policy/privacy-policy.component';
import { TestComponent } from './unregistered/test/test.component';

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
    path: "Test", component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
