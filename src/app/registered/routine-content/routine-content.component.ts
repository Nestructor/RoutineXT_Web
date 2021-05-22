import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Maps } from 'src/app/modules/maps';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-routine-content',
  templateUrl: './routine-content.component.html',
  styleUrls: ['./routine-content.component.css']
})
export class RoutineContentComponent implements OnInit {
  
  hideButtonMessage: boolean = false;
  hideRowMessage: boolean = false;
  stopTimer: boolean = false;
  intervalTimer1: any
  intervalTimer2: any
  
  timeRelax: number
  time: number
  mm: string = "00"
  ss: string = "00"

  page: number = 1

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  completeUserName: string
  name: string
  userImg: any
  now: number = 0 
  userRoutines = []
  map = new Maps();
  actualRoutine = []
  actualRoutineTime: number = 0
  actualRoutineDayTime: number = 0
  actualRoutineTimePeriod: string
  numberOfRoutine:number = 0
  weekday: string
  books = [1, 2]
  actualRoutineExercises = []
  disabled: boolean = true 
  percentage: any
  minutesDone: number

  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore,
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.completeUserName = items.name + " " + items.surname
          this.name = items.name
          this.userImg = items.profile
          if(items.email == 'routineXT_adm@outlook.com') this.router.navigate(['/Tabla_De_Usuarios']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })
  }

  ngOnInit(): void {
    let numberOfuserRoutines = 0
    this.db.collection('routines').get().subscribe((resultado) => {
      resultado.docs.forEach((routineDocs) => {
        let routinesDocsData: any = routineDocs.data()
        if(routinesDocsData.userID == this.userID) {
          numberOfuserRoutines++;
        }
      })
      for (let i = 0; i < numberOfuserRoutines; i++) {
        this.userRoutines[i] = new Array(5);
      }
    })

    this.db.collection('routines').get().subscribe((resultado) => {
      let i = 0
      resultado.docs.forEach((routineDocs) => {
        let routinesDocsData: any = routineDocs.data()
        if(routinesDocsData.userID == this.userID) {
          this.userRoutines[i][0] = this.map.indexWeekdayToWeekday.get(routinesDocsData.weekday)
          this.userRoutines[i][1] = routinesDocsData.dayTime
          this.userRoutines[i][2] = routinesDocsData.timetable
          this.userRoutines[i][3] = routinesDocsData.type
          this.userRoutines[i++][4] = routinesDocsData.completed
        }
      })
      this.sort()
      let aux = new Date().getDay() - 1;
      if(aux == -1) aux = 6
      this.weekday = this.map.indexWeekdayToWeekday.get(aux)
      let timeHours = Number(formatDate(new Date(), "H", 'en')); 
      let timeMinutes = Number(formatDate(new Date(), "m", 'en'));
      let timeInMinutes = timeHours*60+timeMinutes //22:30 -> 2151 minutos
      let startTime, endTime
      for(let i = 0; i < this.userRoutines.length; i++) {
        if(this.userRoutines[i][0] != this.weekday) continue;
        else {
          this.numberOfRoutine = i+1;
          startTime = this.userRoutines[i][2].substring(0, this.userRoutines[i][2].indexOf("-"))
          endTime = this.userRoutines[i][2].substring(this.userRoutines[i][2].indexOf("-")+1)
          if(startTime <= timeInMinutes && timeInMinutes <= endTime) {
            this.actualRoutine = this.userRoutines[i].slice()
            this.actualRoutineTime = endTime-startTime
            this.actualRoutineDayTime = this.actualRoutine[1].substring(0, this.actualRoutine[1].indexOf("(")-1)
            this.actualRoutineTimePeriod = this.convertMinutesToHours(startTime) + "-" + this.convertMinutesToHours(endTime)
            break;
          }
        }
      }
      for (let i = 0; i < this.actualRoutineTime; i++) {
        this.actualRoutineExercises[i] = new Array(3)
      }

      this.db.collection('exercises').get().subscribe((resultado) => {
        let i = 0;
        do {
          resultado.docs.forEach((item) => {
            let exercise:any = item.data();
            if(exercise.type == this.actualRoutine[3]) {
                this.actualRoutineExercises[i][0] = exercise.name
                this.actualRoutineExercises[i][1] = exercise.description
                this.actualRoutineExercises[i++][2] = exercise.image
            }
          })
        } while(i < this.actualRoutineExercises.length)
      })
    })
    
    this.startTimer()
    this.startChrono()
  }

  hideButton() {
    this.hideButtonMessage = !this.hideButtonMessage ? true : false
  }
  
  hideRow() {
    this.hideRowMessage = !this.hideRowMessage ? true : false
  }

  startTimer() {
    this.timeRelax = 25
    this.intervalTimer1 = setInterval(() => {
      if(!this.stopTimer) {
        this.timeRelax = this.timeRelax > 0 ? this.timeRelax-1 : this.timeRelax = 0;
      }
    }, 1000)

    this.time = 85;
    this.intervalTimer2 = setInterval(() => {
      if(!this.stopTimer) {
        this.time = this.time > 0 ? this.time-1 : this.time = 0
      }
    }, 1000)
  }    

  endTimer(page) {
    clearInterval(this.intervalTimer1)
    clearInterval(this.intervalTimer2)
    this.startTimer()
    this.minutesDone = Number(this.mm)
    if(page == this.actualRoutineExercises.length) {
      this.percentage = Math.floor(this.actualRoutineExercises.length * 0.75)
      if(this.minutesDone >= this.percentage) {
        this.disabled = false
      }
    }
  }
  
  startChrono() {
    let intervalTime, minutes = 0, seconds = 0
    intervalTime = setInterval(() => {
      if(!this.stopTimer) {
        if(seconds < 60) {
          seconds++;
          if(seconds == 60) {
            seconds = 0;
            minutes++
            this.mm = minutes < 10 ? "0" + String(minutes) : String(minutes)
          }
          this.ss = seconds < 10 ? "0" + String(seconds) : String(seconds)
        }
      }
    }, 1000)
  }    

  stopTimers() {
    this.stopTimer = !this.stopTimer ? true : false
  }

  endRoutine() {
    this.db.collection('routines').get().subscribe((resultado) => {
      resultado.docs.forEach((routineDocs) => {
        let routinesDocsData: any = routineDocs.data()

        let timetable = routinesDocsData.timetable;
        let starHours = timetable.substring(0, 2);
        if (starHours.indexOf(0) == '0') starHours = timetable.substring(1, 2);          
        let startMinutes = timetable.substring(3, 5)
        if (startMinutes.indexOf(0) == '0') startMinutes = timetable.substring(4, 5)
        let endHours = timetable.substring(6, 8)
        if (endHours.indexOf(0) == '0') endHours = timetable.substring(7, 8)
        let endMinutes = timetable.substring(9, 11)
        if (endMinutes.indexOf(0) == '0') endMinutes = timetable.substring(10, 11)
        timetable = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))

        if(routinesDocsData.userID == this.userID && 
          this.map.indexWeekdayToWeekday.get(routinesDocsData.weekday) == this.actualRoutine[0] &&
          timetable == this.actualRoutine[2]) 
        {
          this.db.collection('routines').doc(routineDocs.id).update({
            completed: 'Y'
          })
        }
      })
    })

    this.db.collection('users').get().subscribe((resultado) => {
      resultado.docs.forEach((userDocs) => {
        let userDocData: any = userDocs.data()
        if(userDocs.id == this.userID) {
          this.db.collection('users').doc(this.userID).update({
            max_score: userDocData.max_score + 5,
            exercises: userDocData.exercises + this.actualRoutineExercises.length,
            routines: userDocData.routines + 1,
            score: userDocData.score + 5
          })
        }
      })
    })    
    
    setInterval(() => {this.router.navigate(['/Puntuación']) }, 2000)
    Swal.fire({
      title: '¡Enhorabuena ' + this.name + "!",
      text: "Has completado la rutina",
      icon: 'success',
      confirmButtonColor: '#009933',
      confirmButtonText: 'Genial',
      backdrop: `
          rgba(0, 0, 0, 0.4)
          url("assets/registered/a.jpg")
          no-repeat
        `,
      input: 'select',
      inputOptions: {
        routine: '+1 rutina',
        score: '+5 puntos',
        exercises: '+' + this.actualRoutineExercises.length + " ejercicios",
        time: Number(this.mm) + " minutos y " + Number(this.ss) + " segundos"
      },
      inputPlaceholder: 'Logros Obtenidos',
    })
        
  }

  private convertMinutesToHours(time: number) {
    let hours = Math.floor(time/60)
    let minutes = time % 60
    let h  = ('0' + hours).slice(-2)
    let m  = ('0' + minutes).slice(-2)
    return h+":"+m
  }

  private sort() {
    let starHours, startMinutes, endHours, endMinutes
    let mondayArray = []
    let tuesdayArray = []
    let wednesdayArray = []
    let thursdayArray = []
    let fridayArray = []
    let saturdayArray = []
    let sundayArray = []
    let mond = 0, tues = 0, wed = 0, thur = 0, frid = 0, sat = 0, sun = 0;
    
    for (let i = 0; i < this.userRoutines.length; i++) {
      switch(this.userRoutines[i][0]) {
        case 'Lunes':
          mondayArray[mond] = this.userRoutines[i].slice()
          starHours = mondayArray[mond][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = mondayArray[mond][2].substring(1, 2);          
          startMinutes = mondayArray[mond][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = mondayArray[mond][2].substring(4, 5)
          endHours = mondayArray[mond][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = mondayArray[mond][2].substring(7, 8)
          endMinutes = mondayArray[mond][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = mondayArray[mond][2].substring(10, 11)
          mondayArray[mond++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Martes':
          tuesdayArray[tues] = this.userRoutines[i].slice()
          starHours = tuesdayArray[tues][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = tuesdayArray[tues][2].substring(1, 2);          
          startMinutes = tuesdayArray[tues][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = tuesdayArray[tues][2].substring(4, 5)
          endHours = tuesdayArray[tues][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = tuesdayArray[tues][2].substring(7, 8)
          endMinutes = tuesdayArray[tues][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = tuesdayArray[tues][2].substring(10, 11)
          tuesdayArray[tues++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Miércoles':
          wednesdayArray[wed] = this.userRoutines[i].slice()
          starHours = wednesdayArray[wed][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = wednesdayArray[wed][2].substring(1, 2);          
          startMinutes = wednesdayArray[wed][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = wednesdayArray[wed][2].substring(4, 5)
          endHours = wednesdayArray[wed][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = wednesdayArray[wed][2].substring(7, 8)
          endMinutes = wednesdayArray[wed][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = wednesdayArray[wed][2].substring(10, 11)
          wednesdayArray[wed++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Jueves':
          thursdayArray[thur] = this.userRoutines[i].slice()
          starHours = thursdayArray[thur][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = thursdayArray[thur][2].substring(1, 2);          
          startMinutes = thursdayArray[thur][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = thursdayArray[thur][2].substring(4, 5)
          endHours = thursdayArray[thur][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = thursdayArray[thur][2].substring(7, 8)
          endMinutes = thursdayArray[thur][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = thursdayArray[thur][2].substring(10, 11)
          thursdayArray[thur++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Viernes':
          fridayArray[frid] = this.userRoutines[i].slice()
          starHours = fridayArray[frid][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = fridayArray[frid][2].substring(1, 2);          
          startMinutes = fridayArray[frid][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = fridayArray[frid][2].substring(4, 5)
          endHours = fridayArray[frid][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = fridayArray[frid][2].substring(7, 8)
          endMinutes = fridayArray[frid][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = fridayArray[frid][2].substring(10, 11)
          fridayArray[frid++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Sábado':
          saturdayArray[sat] = this.userRoutines[i].slice()
          starHours = saturdayArray[sat][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = saturdayArray[sat][2].substring(1, 2);          
          startMinutes = saturdayArray[sat][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = saturdayArray[sat][2].substring(4, 5)
          endHours = saturdayArray[sat][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = saturdayArray[sat][2].substring(7, 8)
          endMinutes = saturdayArray[sat][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = saturdayArray[sat][2].substring(10, 11)
          saturdayArray[sat++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
        case 'Domingo':
          sundayArray[sun] = this.userRoutines[i].slice()
          starHours = sundayArray[sun][2].substring(0, 2);
          if (starHours.indexOf(0) == '0') starHours = sundayArray[sun][2].substring(1, 2);          
          startMinutes = sundayArray[sun][2].substring(3, 5)
          if (startMinutes.indexOf(0) == '0') startMinutes = sundayArray[sun][2].substring(4, 5)
          endHours = sundayArray[sun][2].substring(6, 8)
          if (endHours.indexOf(0) == '0') endHours = sundayArray[sun][2].substring(7, 8)
          endMinutes = sundayArray[sun][2].substring(9, 11)
          if (endMinutes.indexOf(0) == '0') endMinutes = sundayArray[sun][2].substring(10, 11)
          sundayArray[sun++][2] = (Number(starHours)*60 + Number(startMinutes)) + "-" + (Number(endHours)*60 + Number(endMinutes))
          break
      }
    }
    
    mondayArray = this.orderBytime(mondayArray);
    tuesdayArray = this.orderBytime(tuesdayArray);
    wednesdayArray = this.orderBytime(wednesdayArray);
    thursdayArray = this.orderBytime(thursdayArray);
    fridayArray = this.orderBytime(fridayArray);
    saturdayArray = this.orderBytime(saturdayArray);
    sundayArray = this.orderBytime(sundayArray);

    let j = 0;
    for (let i = 0; i < mondayArray.length; i++) {
      this.userRoutines[j++] = mondayArray[i]
    }
    for (let i = 0; i < tuesdayArray.length; i++) {
      this.userRoutines[j++] = tuesdayArray[i]
    }
    for (let i = 0; i < wednesdayArray.length; i++) {
      this.userRoutines[j++] = wednesdayArray[i]
    }
    for (let i = 0; i < thursdayArray.length; i++) {
      this.userRoutines[j++] = thursdayArray[i]
    }
    for (let i = 0; i < fridayArray.length; i++) {
      this.userRoutines[j++] = fridayArray[i]
    }
    for (let i = 0; i < saturdayArray.length; i++) {
      this.userRoutines[j++] = saturdayArray[i]
    }
    for (let i = 0; i < sundayArray.length; i++) {
      this.userRoutines[j++] = sundayArray[i]
    }
  }

  private orderBytime(array: any) {
    let totalMinutes1: number = 0
    let totalMinutes2: number = 0
    let aux: number;
    for (let i = 1; i < array.length; i++) {
      totalMinutes2 += Number(array[i][2].substring(0, array[i][2].indexOf("-"))) + Number(array[i][2].substring(array[i][2].indexOf("-") + 1))
      totalMinutes1 += Number(array[i-1][2].substring(0, array[i-1][2].indexOf("-"))) + Number(array[i-1][2].substring(array[i-1][2].indexOf("-") + 1))
      if (totalMinutes2 < totalMinutes1) {
        aux = array[i-1];
        array[i-1] = array[i];
        array[i] = aux;
      }
    }
    return array;
  }

}
