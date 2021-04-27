import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Maps } from 'src/app/modules/maps';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  completeUserName: string
  userImg: any
  userEmail: string
  userScore: number
  userRanking: number;
  routinesDone: number = 0
  scoreAchieved: number = 0
  totalRoutines: number = 0
  routines: any = []
  map = new Maps();
  usersData = []

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
          this.userScore = items.score
          this.userEmail = items.email
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })

  }

  ngOnInit(): void {

    for(var i=0; i < 21; i++) {
      this.routines[i] = new Array(4);
    }

    this.db.collection('routines').get().subscribe((resultado) => {
      let i = 0
      resultado.docs.forEach((item) => {
        let routine:any = item.data();
        if(this.userID == routine.userID) {
          this.totalRoutines++
          this.routines[i][0] = this.map.indexWeekdayToWeekday.get(routine.weekday)
          this.routines[i][1] = routine.type
          this.routines[i][2] = routine.timetable
          this.routines[i++][3] = routine.completed
          if(routine.completed == 'Yes') {
            this.routinesDone++;
            this.scoreAchieved += 10
          } else if(routine.completed == 'No') {
            this.scoreAchieved -= 10
          }
        }
      })
    })

    this.db.collection('users').get().subscribe((resultado) => {
      let i = 0
      for(let j=0; j < resultado.size-1; j++) {
        this.usersData[j] = new Array(3);
      }

      resultado.docs.forEach((item) => {
        let user:any = item.data();
        if(user.name != 'routineXT') {
          this.usersData[i][0] = user.name
          this.usersData[i][1] = user.score
          this.usersData[i++][2] = user.email
        }
      })
      this.sort();
    })

    this.user$.subscribe((user) => {
      this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
        let items: any = resultado.data()
        for (let i = 0; i < this.usersData.length; i++) {
          if(this.usersData[i][2] == items.email) {
             this.userRanking = i+1;
             break;
          }
        }
      })
    })
  }

  private sort() {
    let aux: number;
    for (let k = 1; k < this.usersData.length; k++) {
      for (let i = 0; i < (this.usersData.length - k); i++) {
        if (this.usersData[i][1] < this.usersData[i+1][1]) {
          aux = this.usersData[i];
          this.usersData[i] = this.usersData[i+1];
          this.usersData[i+1] = aux;
        }
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
