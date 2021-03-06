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
import { ProfileComponent } from './registered/profile/profile.component';
import { EditProfileComponent } from './registered/edit-profile/edit-profile.component';
import { AdviceComponent } from './registered/advice/advice.component';
import { ScoreComponent } from './registered/score/score.component';
import { ExerciseComponent } from './registered/exercise/exercise.component';
import { ChallengeComponent } from './registered/challenge/challenge.component';
import { ChallengeAdmComponent } from './admin/challenge-adm/challenge-adm.component';
import { EditProfileAdmComponent } from './admin/edit-profile-adm/edit-profile-adm.component';
import { ExerciseAdmComponent } from './admin/exercise-adm/exercise-adm.component';
import { ProfileAdmComponent } from './admin/profile-adm/profile-adm.component';
import { UserAdmComponent } from './admin/user-adm/user-adm.component';
import { StartRoutineComponent } from './registered/start-routine/start-routine.component';
import { RoutineComponent } from './registered/routine/routine.component';

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
    path: "FAQs_Contacto", component: FaqsContactComponent
  },
  {
    path: "Nueva_Contraseña", component: ResetPasswordComponent
  },
  {
    path: "Plan_De_Entrenamiento", component: TrainingPlanComponent
  },
  {
    path: "Perfil", component: ProfileComponent
  },
  {
    path: "Editar_Perfil", component: EditProfileComponent
  },
  {
    path: "Consejos", component: AdviceComponent
  },
  {
    path: 'Puntuación', component: ScoreComponent
  },
  {
    path: 'Ejercicios', component: ExerciseComponent
  },
  {
    path: 'Retos', component: ChallengeComponent
  },
  {
    path: 'Tabla_De_Usuarios', component: UserAdmComponent
  },
  {
    path: 'Tabla_De_Retos', component: ChallengeAdmComponent
  },
  {
    path: 'Tabla_De_Ejercicios', component: ExerciseAdmComponent
  },
  {
    path: 'Perfil_Adm', component: ProfileAdmComponent
  },
  {
    path: 'Editar_Perfil_Adm', component: EditProfileAdmComponent
  },
  {
    path: 'Comenzar_Rutina', component: StartRoutineComponent
  },
  {
    path: 'Rutina', component: RoutineComponent
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
