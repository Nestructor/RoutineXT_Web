import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { monthMap } from 'src/app/modules/month-map';

@Component({
  selector: 'app-training-plan',
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.css']
})

export class TrainingPlanComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  loading: boolean = true
  firstDayOfWeek: string = "Lunes ";
  lastDayOfWeek: string = "Domingo ";

  constructor(private  authSvc: AuthService, private router: Router, private spinner: NgxSpinnerService) {
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if (!this.isLogged) {
        this.router.navigate(['/Iniciar_Sesion']) 
      } else {
        this.spinner.show()
        setTimeout(() => {
          this.spinner.hide()
          this.loading = false
        }, 1000)
      }
    })
  }

  ngOnInit() {
    let today: Date = new Date();
    let weekday: string = formatDate(today, 'EEEE', 'en');
    let diaEnMilisegundos = 1000 * 60 * 60 * 24;
    let month = new monthMap();

    switch(weekday) { 
      case 'Monday': { 
        this.firstDayOfWeek += formatDate(today.getTime(), 'dd', 'en'); + ' de ' + formatDate(today.getTime(), 'MM', 'en');
        this.lastDayOfWeek += formatDate(today.getTime() + diaEnMilisegundos*6, 'dd', 'en') + " de " + formatDate(today.getTime() + diaEnMilisegundos*6, 'MM', 'en');
        break; 
      } 
      case 'Tuesday': { 
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(today.getTime() + diaEnMilisegundos*5, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() + diaEnMilisegundos*5, 'MM', 'en'));
        break; 
      } 
      case 'Wednesday': { 
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos*2, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos*2, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(today.getTime() + diaEnMilisegundos*4, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() + diaEnMilisegundos*4, 'MM', 'en'));
         break; 
      } 
      case 'Thursday': { 
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos*3, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos*3, 'MM', 'en')); 
        this.lastDayOfWeek += formatDate(today.getTime() + diaEnMilisegundos*3, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() + diaEnMilisegundos*3, 'MM', 'en')); 
        break; 
      } 
      case 'Friday': { 
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos*4, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos*4, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(today.getTime() + diaEnMilisegundos*2, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() + diaEnMilisegundos*2, 'MM', 'en'));
        break; 
      } 
      case 'Saturday': { 
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos, 'MM', 'en'));
        
        break; 
      } 
      case 'Sunday': { 
        this.lastDayOfWeek += formatDate(today.getTime(), 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime(), 'MM', 'en'));
        this.firstDayOfWeek += formatDate(today.getTime() - diaEnMilisegundos*6, 'dd', 'en') + " de " + month.map.get(formatDate(today.getTime() - diaEnMilisegundos*6, 'MM', 'en'));
         break; 
      } 
    } 
  }

  async onLogout() {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    try {
      await this.authSvc.logout()
      this.router.navigate(['/Iniciar_Sesion'])
      Toast.fire({
        icon: 'success',
        title: 'Sesión cerrada correctamente'
      })
    } catch(error) {
      console.log(error)
    }
  }

}
