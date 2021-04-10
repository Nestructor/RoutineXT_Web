import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { Maps } from 'src/app/modules/maps';
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
  startTime: Date = new Date();
  endTime: Date = new Date();
  isTimeCorrect: boolean = false
  timeDay: string = ''; //Mañana (00:00-12:59)
  today: Date = new Date(); //1212165549849
  weekday: string = formatDate(this.today, 'EEEE', 'en'); //Saturday
  weekdayModal: string = ''; //Martes
  weekdayIndex: number; //0-6
  selectedRoutine: string = '1';
  map = new Maps();

  morningRoutines = [];
  afternoonRoutines = [];
  nightRoutines = [];
  modalState: boolean = false;
  editableDays = []

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

    for(var i=0; i<4; i++) {
      this.morningRoutines[i] = new Array(7);
      this.afternoonRoutines[i] = new Array(7);
      this.nightRoutines[i] = new Array(7);
    }
    
    for(var j=0; j<7; j++) {
      this.morningRoutines[3][j] = false
    }

    for(var k=0; k<7; k++) {
      this.editableDays[k] = true
    }

    // morningRoutines: string[][] 
    // afternoonRoutines: string[][]
    // nightRoutines: string[][]
    // this.morningRoutines = [ ["","","","","","",""], ["","","","","","",""], ["","","","","","",""] ]
    // this.afternoonRoutines = [ ["","","","","","",""], ["","","","","","",""], ["","","","","","",""] ]
    // this.nightRoutines = [ ["","","","","","",""], ["","","","","","",""], ["","","","","","",""] ]
    
  }

  ngOnInit() {
    let dayToMilliseconds = 1000 * 60 * 60 * 24
    
    switch(this.weekday) { 
      case 'Monday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime(), 'dd', 'en') + ' de ' + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime(), 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds*6, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds*6, 'MM', 'en'));
        break; 
      } 
      case 'Tuesday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds*5, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds*5, 'MM', 'en'));
        break; 
      }  
      case 'Wednesday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds*2, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds*2, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds*4, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds*4, 'MM', 'en'));
         break; 
      } 
      case 'Thursday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds*3, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds*3, 'MM', 'en')); 
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds*3, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds*3, 'MM', 'en')); 
        break; 
      } 
      case 'Friday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds*4, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds*4, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds*2, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds*2, 'MM', 'en'));
        break; 
      } 
      case 'Saturday': { 
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds*5, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds*5, 'MM', 'en'));
        this.lastDayOfWeek += formatDate(this.today.getTime() + dayToMilliseconds, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() + dayToMilliseconds, 'MM', 'en'));
        break; 
      } 
      case 'Sunday': { 
        this.lastDayOfWeek += formatDate(this.today.getTime(), 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime(), 'MM', 'en'));
        this.firstDayOfWeek += formatDate(this.today.getTime() - dayToMilliseconds*6, 'dd', 'en') + " de " + this.map.numberMonthToStringMonth.get(formatDate(this.today.getTime() - dayToMilliseconds*6, 'MM', 'en'));
         break;
      } 
    } 

    let weekdayFormatDate = formatDate(this.today.getTime(), 'EEEE', 'es')
    weekdayFormatDate = weekdayFormatDate.charAt(0).toUpperCase() + weekdayFormatDate.substring(1)
    let todayIndex = this.map.weekdayToIndexArray.get(weekdayFormatDate)
    
    for(var i = 0; i < todayIndex; i++) {
      this.editableDays[i] = false
    }

    // this.editableDays.forEach(e => console.log(e))

  }

  verifyTimeSelectedInModal() {
    let startTimeInMinutes: number = this.startTime.getHours()*60 + this.startTime.getMinutes();
    let endTimeInMinutes: number = this.endTime.getHours()*60 + this.endTime.getMinutes();
    this.isTimeCorrect = (endTimeInMinutes - startTimeInMinutes <= 60 && endTimeInMinutes - startTimeInMinutes >= 15)  == true;
    if((this.timeDay == 'Mañana (00:00-12:59)') && (this.startTime.getHours() > 12)) {
      this.isTimeCorrect = false
    } else if((this.timeDay == 'Tarde (13:00-19:59)') && (this.startTime.getHours() < 13 || this.endTime.getHours() > 19)) {
      this.isTimeCorrect = false
    } else if((this.timeDay == 'Noche (20:00-23:59)') && (this.startTime.getHours() < 20 )) {
      this.isTimeCorrect = false
    }
    // console.log(this.timeDay)
    // console.log(this.startTime.getHours()+":"+this.startTime.getMinutes() + " - " + this.endTime.getHours()+":"+this.endTime.getMinutes() + " -> " + this.isTimeCorrect + " (" + (endTimeInMinutes - startTimeInMinutes) +")")
  }

  openModal(modal: TemplateRef<any>, weekdayModal: string, timeDay:string) {
    this.weekdayModal = weekdayModal
    this.timeDay = timeDay
    this.weekdayIndex = this.map.weekdayToIndexArray.get(this.weekdayModal);

    switch(this.timeDay) {
      case 'Mañana (00:00-12:59)':
        this.modalState = this.morningRoutines[3][this.weekdayIndex]
        break;
      case 'Tarde (13:00-19:59)':
        this.modalState = this.afternoonRoutines[3][this.weekdayIndex]
        break;
      case 'Noche (20:00-23:59)':
        this.modalState = this.nightRoutines[3][this.weekdayIndex]
        break 
    }
    this.modalRef = this.modalService.show(modal);
  }

  addRoutine() {
    let routine = this.map.routineTypeToRoutine.get(this.selectedRoutine);
    let routineBgColor = this.map.routineToBgColor.get(routine)

    let startHoursSelected = this.startTime.getHours().toString();
    let endHoursSelected = this.endTime.getHours().toString();
    let startMinutesSelected = this.startTime.getMinutes().toString();
    let endMinutesSelected = this.endTime.getMinutes().toString();
    if(this.startTime.getHours() < 10) {
      startHoursSelected = "0" + this.startTime.getHours()
    }
    if(this.endTime.getHours() < 10) {
      endHoursSelected = "0" + this.endTime.getHours()
    }
    if(this.startTime.getMinutes() < 10) {
      startMinutesSelected = "0" + this.startTime.getMinutes()
    }
    if(this.endTime.getMinutes() < 10) {
      endMinutesSelected = "0" + this.endTime.getMinutes()
    }

    switch(this.timeDay) {
      case 'Mañana (00:00-12:59)':
        this.morningRoutines[0][this.weekdayIndex] = routine;
        this.morningRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
        this.morningRoutines[2][this.weekdayIndex] = routineBgColor
        this.morningRoutines[3][this.weekdayIndex] = true
        break;
      case 'Tarde (13:00-19:59)':
        this.afternoonRoutines[0][this.weekdayIndex] = routine;
        this.afternoonRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
        this.afternoonRoutines[2][this.weekdayIndex] = routineBgColor
        this.afternoonRoutines[3][this.weekdayIndex] = true
        break;
      case 'Noche (20:00-23:59)':
        this.nightRoutines[0][this.weekdayIndex] = routine;
        this.nightRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
        this.nightRoutines[2][this.weekdayIndex] = routineBgColor
        this.nightRoutines[3][this.weekdayIndex] = true
        break;
    }

    // this.morningRoutines.forEach(e => console.log(e))

    // this.nightRoutines[0][0] = "Glúteos"
    // this.nightRoutines[1][0] = "12:35"
    // this.nightRoutines[2][0] = "#ffa749"
    
    // console.log(this.timeDay + " - " + this.weekday)
    // console.log(routine + " (" + routineBgColor + ")")
    // console.log(startHoursSelected + ":" + startMinutesSelected)
    // console.log(endHoursSelected + ":" + endMinutesSelected)
    this.modalRef.hide()
  }

  deleteRoutine() {
    // console.log(this.timeDay + "   " + this.weekday + "   " + this.weekdayModal + "   " + this.weekdayIndex)
    
    switch(this.timeDay) {
      case 'Mañana (00:00-12:59)':
        this.morningRoutines[0][this.weekdayIndex] = '';
        this.morningRoutines[1][this.weekdayIndex] = ''
        this.morningRoutines[2][this.weekdayIndex] = ''
        this.morningRoutines[3][this.weekdayIndex] = false
        break;
      case 'Tarde (13:00-19:59)':
        this.afternoonRoutines[0][this.weekdayIndex] = '';
        this.afternoonRoutines[1][this.weekdayIndex] = ''
        this.afternoonRoutines[2][this.weekdayIndex] = ''
        this.afternoonRoutines[3][this.weekdayIndex] = false
        break;
      case 'Noche (20:00-23:59)':
        this.nightRoutines[0][this.weekdayIndex] = ''
        this.nightRoutines[1][this.weekdayIndex] = ''
        this.nightRoutines[2][this.weekdayIndex] = ''
        this.nightRoutines[3][this.weekdayIndex] = false
        break;
    }
    this.modalRef.hide()
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
