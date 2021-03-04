import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './unregistered/account/account.component';
import { HomeComponent } from './unregistered/home/home.component';
import { LoginComponent } from './unregistered/login/login.component';
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
    path: "Test", component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
