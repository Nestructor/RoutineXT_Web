import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { Maps } from 'src/app/modules/maps';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-training-plan',
  templateUrl: './training-plan.component.html',
  styleUrls: ['./training-plan.component.css']
})

export class TrainingPlanComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  userImg: any
  completeUserName: string
  
  firstDayOfWeek: string = "Lunes ";
  lastDayOfWeek: string = "Domingo ";
  modalRef: BsModalRef
  startTime: Date = new Date();
  endTime: Date = new Date();
  isTimeCorrect: boolean = false
  dayTime: string = ''; //Mañana (00:00-12:59)
  today: Date = new Date(); //1212165549849
  weekday: string = formatDate(this.today, 'EEEE', 'en'); //Saturday
  weekdayModal: string = ''; //Martes
  weekdayIndex: number; //0-6
  selectedRoutine: string = '1';
  map = new Maps();

  morningRoutines = [];
  afternoonRoutines = [];
  nightRoutines = [];
  modalState: string = ''
  editableDays = []
  cancelTrainingPlan: boolean;
  todayIndex: number;

  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private modalService: BsModalService,
    private db: AngularFirestore,
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.completeUserName = items.name + " " + items.surname
          this.userImg = items.profile
          this.cancelTrainingPlan = items.trainingPlanCancelled
          for(var k=0; k<7; k++) {
            this.editableDays[k] = this.cancelTrainingPlan ? false : true
          }
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }

    })

    for(var i=0; i<4; i++) {
      this.morningRoutines[i] = new Array(7);
      this.afternoonRoutines[i] = new Array(7);
      this.nightRoutines[i] = new Array(7);
    }
    
    for(var j=0; j<7; j++) {
      this.morningRoutines[3][j] = ''
    }

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
    this.todayIndex = this.map.weekdayToIndexArray.get(weekdayFormatDate)
    
    for(var i = 0; i < this.todayIndex; i++) {
      this.editableDays[i] = false
    }

    // this.editableDays.forEach(e => console.log(e))

    this.db.collection('routines').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let routineID = item.ref.id
        let routine:any = item.data(); //Identificador del cliente
        if(this.userID == routine.userID) {
            switch(routine.dayTime) {
              case 'Mañana (00:00-12:59)':
                this.morningRoutines[0][routine.weekday] = routine.type;
                this.morningRoutines[1][routine.weekday] = routine.timetable
                this.morningRoutines[2][routine.weekday] = this.map.routineToBgColor.get(routine.type);
                this.morningRoutines[3][routine.weekday] = routineID
                break;
              case 'Tarde (13:00-19:59)':
                this.afternoonRoutines[0][routine.weekday] = routine.type;
                this.afternoonRoutines[1][routine.weekday] = routine.timetable
                this.afternoonRoutines[2][routine.weekday] = this.map.routineToBgColor.get(routine.type);
                this.afternoonRoutines[3][routine.weekday] = routineID
                break;
              case 'Noche (20:00-23:59)':
                this.nightRoutines[0][routine.weekday] = routine.type;
                this.nightRoutines[1][routine.weekday] = routine.timetable
                this.nightRoutines[2][routine.weekday] = this.map.routineToBgColor.get(routine.type);
                this.nightRoutines[3][routine.weekday] = routineID
                break;
            }
          }
      })
    })

  }

  verifyTimeSelectedInModal() {
    let startTimeInMinutes: number = this.startTime.getHours()*60 + this.startTime.getMinutes();
    let endTimeInMinutes: number = this.endTime.getHours()*60 + this.endTime.getMinutes();
    this.isTimeCorrect = (endTimeInMinutes - startTimeInMinutes <= 60 && endTimeInMinutes - startTimeInMinutes >= 15)  == true;
    if((this.dayTime == 'Mañana (00:00-12:59)') && (this.startTime.getHours() > 12)) {
      this.isTimeCorrect = false
    } else if((this.dayTime == 'Tarde (13:00-19:59)') && (this.startTime.getHours() < 13 || this.endTime.getHours() > 19)) {
      this.isTimeCorrect = false
    } else if((this.dayTime == 'Noche (20:00-23:59)') && (this.startTime.getHours() < 20 )) {
      this.isTimeCorrect = false
    }
  }

  openModal(modal: TemplateRef<any>, weekdayModal: string, dayTime:string) {
    this.weekdayModal = weekdayModal
    this.dayTime = dayTime
    this.weekdayIndex = this.map.weekdayToIndexArray.get(this.weekdayModal);
    switch(this.dayTime) {
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

 checkRoutine() {
    let routine = this.map.routineTypeToRoutine.get(this.selectedRoutine);

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

    switch(this.dayTime) {
      case 'Mañana (00:00-12:59)':
        this.morningRoutines[3][this.weekdayIndex] == '' || this.morningRoutines[3][this.weekdayIndex] == undefined 
          ? this.addRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected)
          : this.updateRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected, this.morningRoutines[3][this.weekdayIndex]) 
        break
      case 'Tarde (13:00-19:59)':
        this.afternoonRoutines[3][this.weekdayIndex] == '' || this.afternoonRoutines[3][this.weekdayIndex] == undefined 
          ? this.addRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected)
          : this.updateRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected, this.afternoonRoutines[3][this.weekdayIndex]) 
        break
      case 'Noche (20:00-23:59)':
        this.nightRoutines[3][this.weekdayIndex] == '' || this.nightRoutines[3][this.weekdayIndex] == undefined 
          ? this.addRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected)
          : this.updateRoutine(routine, startHoursSelected, startMinutesSelected, endHoursSelected, endMinutesSelected, this.nightRoutines[3][this.weekdayIndex]) 
        break  
    }
    this.modalRef.hide()
  }
  
  addRoutine(routine: string, startHoursSelected: string, startMinutesSelected: string, endHoursSelected: string, endMinutesSelected: string) {
    this.db.collection('routines').add({
      weekday: this.weekdayIndex,
      dayTime: this.dayTime,
      type: routine,
      timetable: startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected,
      completed: "",
      userID: this.userID
    }).then((routineID)=> {
      console.log(this.dayTime)
      switch(this.dayTime) {
        case 'Mañana (00:00-12:59)':
          this.morningRoutines[0][this.weekdayIndex] = routine;
          this.morningRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.morningRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          this.morningRoutines[3][this.weekdayIndex] = routineID.id
          break;
        case 'Tarde (13:00-19:59)':
          this.afternoonRoutines[0][this.weekdayIndex] = routine;
          this.afternoonRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.afternoonRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          this.afternoonRoutines[3][this.weekdayIndex] = routineID.id
          break;
        case 'Noche (20:00-23:59)':
          this.nightRoutines[0][this.weekdayIndex] = routine;
          this.nightRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.nightRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          this.nightRoutines[3][this.weekdayIndex] = routineID.id
          break;
      }
    })
  }

  updateRoutine(routine: string, startHoursSelected: string, startMinutesSelected: string, endHoursSelected: string, endMinutesSelected: string, routineID: string) {
    this.db.collection('routines').doc(routineID).update({
      weekday: this.weekdayIndex,
      dayTime: this.dayTime,
      type: routine,
      timetable: startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected,
      completed: "",
      userID: this.userID
    }).then((updated) => {
      switch(this.dayTime) {
        case 'Mañana (00:00-12:59)':
          this.morningRoutines[0][this.weekdayIndex] = routine;
          this.morningRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.morningRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          break;
        case 'Tarde (13:00-19:59)':
          this.afternoonRoutines[0][this.weekdayIndex] = routine;
          this.afternoonRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.afternoonRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          break;
        case 'Noche (20:00-23:59)':
          this.nightRoutines[0][this.weekdayIndex] = routine;
          this.nightRoutines[1][this.weekdayIndex] = startHoursSelected+":"+startMinutesSelected + "-" + endHoursSelected + ":" + endMinutesSelected
          this.nightRoutines[2][this.weekdayIndex] = this.map.routineToBgColor.get(routine)
          break;
      }
    })
  }

  deleteRoutine() {    
    switch(this.dayTime) {
      case 'Mañana (00:00-12:59)':
        this.db.collection('routines').doc(this.morningRoutines[3][this.weekdayIndex]).delete()
        this.morningRoutines[0][this.weekdayIndex] = ''
        this.morningRoutines[1][this.weekdayIndex] = ''
        this.morningRoutines[2][this.weekdayIndex] = ''
        this.morningRoutines[3][this.weekdayIndex] = ''
        break;
      case 'Tarde (13:00-19:59)':
        this.db.collection('routines').doc(this.afternoonRoutines[3][this.weekdayIndex]).delete()
        this.afternoonRoutines[0][this.weekdayIndex] = ''
        this.afternoonRoutines[1][this.weekdayIndex] = ''
        this.afternoonRoutines[2][this.weekdayIndex] = ''
        this.afternoonRoutines[3][this.weekdayIndex] = ''
        break;
      case 'Noche (20:00-23:59)':
        this.db.collection('routines').doc(this.nightRoutines[3][this.weekdayIndex]).delete()
        this.nightRoutines[0][this.weekdayIndex] = ''
        this.nightRoutines[1][this.weekdayIndex] = ''
        this.nightRoutines[2][this.weekdayIndex] = ''
        this.nightRoutines[3][this.weekdayIndex] = ''
        break;
    }
    this.modalRef.hide()
  }

  disableTrainingPlan() {
    this.db.collection('users').doc(this.userID).update({
      trainingPlanCancelled: true
    })
    this.cancelTrainingPlan = true;
    for (let i = 0; i < 7; i++) {
      this.editableDays[i] = false;
    }
    console.log("Disabled: " + this.editableDays)
  }

  enableTrainingPlan() {
    this.db.collection('users').doc(this.userID).update({
      trainingPlanCancelled: false
    })
    this.cancelTrainingPlan = false;
    for(var i = this.todayIndex; i < 7; i++) {
      this.editableDays[i] = true;
    }
    console.log("Enabled: " + this.editableDays)
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