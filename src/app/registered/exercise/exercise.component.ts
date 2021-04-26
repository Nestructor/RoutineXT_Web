import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Maps } from 'src/app/modules/maps';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  completeUserName: string
  userImg: any
  userRoutines: any = []
  map = new Maps();
  routineMinutes = []
  routineExercises = []
  showEmptyPlanning = false;

  flexibility: any = []
  abs: any = []
  buttock: any = []
  legs: any = []
  arms: any = []

  
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
          this.userImg = items.profile
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })
  }

  ngOnInit(): void {

    for (let i = 0; i < 60; i++) {
      this.flexibility[i] = new Array(4)
      this.abs[i] = new Array(4)
      this.buttock[i] = new Array(4)
      this.legs[i] = new Array(4)
      this.arms[i] = new Array(4)
    }

    this.db.collection('exercises').get().subscribe((resultado) => {
      let f = 0, g = 0, p = 0, b = 0, a = 0
      resultado.docs.forEach((item) => {
        let exercise:any = item.data();
        switch(exercise.type) {
          case 'Flexibilidad':
            this.flexibility[f][0] = exercise.name
            this.flexibility[f][1] = exercise.type
            this.flexibility[f][2] = exercise.description
            this.flexibility[f++][3] = exercise.image
            break
          case 'Glúteos':
              this.buttock[g][0] = exercise.name
              this.buttock[g][1] = exercise.type
              this.buttock[g][2] = exercise.description
              this.buttock[g++][3] = exercise.image
            break
          case 'Piernas':
            this.legs[p][0] = exercise.name
            this.legs[p][1] = exercise.type
            this.legs[p][2] = exercise.description
            this.legs[p++][3] = exercise.image
            break
          case 'Brazos':
            this.arms[b][0] = exercise.name
            this.arms[b][1] = exercise.type
            this.arms[b][2] = exercise.description
            this.arms[b++][3] = exercise.image
            break
          case 'Abdominales':
            this.abs[a][0] = exercise.name
            this.abs[a][1] = exercise.type
            this.abs[a][2] = exercise.description
            this.abs[a++][3] = exercise.image
          break
        }
      })
    })

    this.db.collection('routines').get().subscribe((resultado) => {
      let i = 0, startMinutes, endMinutes
      resultado.docs.forEach((item) => {
        let routine:any = item.data();
        if(this.userID == routine.userID) {
          startMinutes = routine.timetable.substring(0, routine.timetable.indexOf("-"));
          endMinutes = routine.timetable.substring(routine.timetable.indexOf("-")+1);
          startMinutes = Number(startMinutes.substring(0, startMinutes.indexOf(":")))*60 + Number(startMinutes.substring(startMinutes.indexOf(":")+1));
          endMinutes = Number(endMinutes.substring(0, endMinutes.indexOf(":")))*60 + Number(endMinutes.substring(endMinutes.indexOf(":")+1));
          this.routineMinutes[i] = endMinutes - startMinutes;

          this.userRoutines[i] = 
            this.map.indexWeekdayToWeekday.get(routine.weekday) + " - " + routine.type 
            + " de " + routine.timetable.substring(0, routine.timetable.indexOf("-")) + " a " + routine.timetable.substring(routine.timetable.indexOf("-")+1) 
            + " (" + this.routineMinutes[i++] + " minutos)"
            
        }
      })

      for (let j = 0; j < this.userRoutines.length; j++) {
        if(this.userRoutines[j].includes("Brazos")) {
            for (let k = 15; k < this.routineMinutes[j]; k++) {
              this.arms[k][0] = this.arms[k-15][0]
              this.arms[k][1] = this.arms[k-15][1]
              this.arms[k][2] = this.arms[k-15][2]
              this.arms[k][3] = this.arms[k-15][3]
            }
            this.routineExercises[j] = this.arms.slice(0, this.routineMinutes[j]);

        } else if (this.userRoutines[j].includes("Flexibilidad")) {
          for (let k = 15; k < this.routineMinutes[j]; k++) {
            this.flexibility[k][0] = this.flexibility[k-15][0]
            this.flexibility[k][1] = this.flexibility[k-15][1]
            this.flexibility[k][2] = this.flexibility[k-15][2]
            this.flexibility[k][3] = this.flexibility[k-15][3]
          }
          this.routineExercises[j] = this.flexibility.slice(0, this.routineMinutes[j]);

        } else if (this.userRoutines[j].includes("Abdominales")) {
          for (let k = 15; k < this.routineMinutes[j]; k++) {
            this.abs[k][0] = this.abs[k-15][0]
            this.abs[k][1] = this.abs[k-15][1]
            this.abs[k][2] = this.abs[k-15][2]
            this.abs[k][3] = this.abs[k-15][3]
          }
          this.routineExercises[j] = this.abs.slice(0, this.routineMinutes[j]);

        } else if (this.userRoutines[j].includes("Piernas")) {
          for (let k = 15; k < this.routineMinutes[j]; k++) {
            this.legs[k][0] = this.legs[k-15][0]
            this.legs[k][1] = this.legs[k-15][1]
            this.legs[k][2] = this.legs[k-15][2]
            this.legs[k][3] = this.legs[k-15][3]
          }
          this.routineExercises[j] = this.legs.slice(0, this.routineMinutes[j]);

        } else if (this.userRoutines[j].includes("Glúteos")) {
          for (let k = 15; k < this.routineMinutes[j]; k++) {
            this.buttock[k][0] = this.buttock[k-15][0]
            this.buttock[k][1] = this.buttock[k-15][1]
            this.buttock[k][2] = this.buttock[k-15][2]
            this.buttock[k][3] = this.buttock[k-15][3]
          }
          this.routineExercises[j] = this.buttock.slice(0, this.routineMinutes[j]);
        }
      }

      if(this.userRoutines.length == 0) {
        this.showEmptyPlanning = true;
      }

    })
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
