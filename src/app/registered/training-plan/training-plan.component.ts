import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { monthMap } from 'src/app/modules/month-map';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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

  modalRef: BsModalRef;
  isMeridian = false;
  today: Date = new Date();
  weekday: string = formatDate(this.today, 'EEEE', 'en');
  startTime: Date = new Date();
  endTime: Date = new Date();
  isTimeCorrect: boolean = false
  timeDay: string = '';

  verifyTime() {
    let startTimeInMinutes: number = this.startTime.getHours()*60 + this.startTime.getMinutes();
    let endTimeInMinutes: number = this.endTime.getHours()*60 + this.endTime.getMinutes();
    this.isTimeCorrect = (endTimeInMinutes - startTimeInMinutes <= 60 && endTimeInMinutes - startTimeInMinutes >= 15)  == true;
    // console.log(this.startTime.getHours()+":"+this.startTime.getMinutes() + " - " + this.endTime.getHours()+":"+this.endTime.getMinutes() + " -> " + this.isTimeCorrect + "(" + (endTimeInMinutes - startTimeInMinutes) +")")
  }

  constructor(
    private  authSvc: AuthService, 
    private router: Router, 
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if (!this.isLogged) {
        this.router.navigate(['/Iniciar_Sesion']) 
      } else {
        this.spinner.show()
        setTimeout(() => {
          this.spinner.hide()
          this.loading = false
        }, 0)
      }
    })
    
  }

  ngOnInit() {
    let diaEnMilisegundos = 1000 * 60 * 60 * 24;
    let month = new monthMap();

    switch(this.weekday) { 
      case 'Monday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime(), 'dd', 'en') + ' de ' + month.map.get(formatDate(this.today.getTime(), 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + diaEnMilisegundos*6, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() + diaEnMilisegundos*6, 'MM', 'en'));
        break; 
      } 
      case 'Tuesday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + diaEnMilisegundos*5, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() + diaEnMilisegundos*5, 'MM', 'en'));
        break; 
      }  
      case 'Wednesday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos*2, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos*2, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + diaEnMilisegundos*4, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() + diaEnMilisegundos*4, 'MM', 'en'));
         break; 
      } 
      case 'Thursday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos*3, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos*3, 'MM', 'en')); 
        this.lastDayOfWeek += formatDate(this.today.getTime() + diaEnMilisegundos*3, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() + diaEnMilisegundos*3, 'MM', 'en')); 
        break; 
      } 
      case 'Friday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos*4, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos*4, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + diaEnMilisegundos*2, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() + diaEnMilisegundos*2, 'MM', 'en'));
        break; 
      } 
      case 'Saturday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos, 'MM', 'en'));
        
        break; 
      } 
      case 'Sunday': { 
        this.lastDayOfWeek += formatDate(this.today.getTime(), 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime(), 'MM', 'en'));
        this.firstDayOfWeek += formatDate(this.today.getTime() - diaEnMilisegundos*6, 'dd', 'en') + " de " + month.map.get(formatDate(this.today.getTime() - diaEnMilisegundos*6, 'MM', 'en'));
         break;
      } 
    } 
  }

  openModal(modal: TemplateRef<any>, number:number) {
    this.modalRef = this.modalService.show(modal);
    switch(number) {
      case 1:
        this.timeDay = 'Mañana'
        break
      case 2:
        this.timeDay = 'Tarde'
        break
      case 3:
        this.timeDay = 'Noche'
        break
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
