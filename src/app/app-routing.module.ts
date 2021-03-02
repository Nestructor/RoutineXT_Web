import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './unregistered/home/home.component';
import { LoginComponent } from './unregistered/login/login.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "Iniciar_Sesion", component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
