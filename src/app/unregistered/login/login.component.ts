import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Maps } from 'src/app/modules/maps';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  validData: boolean = true
  
  user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  userID: string;
  name: string
  userRoutines = []
  map = new Maps();
  weekday: number
  
  constructor(
    private authSrv: AuthService, 
    private router: Router, 
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private db: AngularFirestore
  ) 
  { 
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if(this.isLogged) {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name;
        })
      }
    })
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    const {email, password} = this.loginForm.value
    try {
      const login =  await this.authSrv.login(email, password)
      if(login != "error") {
        email == 'routineXT_adm@outlook.com' ? this.showAdminLoading() : this.showLoading(login.user.uid)
      } else {
        this.validData = false
        this.loginForm.reset()
      }
    } catch(error) {
      console.log(error)
    }
  }

  async showLoading(user_id) {
    this.spinner.show()
    setTimeout(() => {
      this.updateScore(user_id)
      this.router.navigate(['/Plan_De_Entrenamiento']) 
      this.spinner.hide()
    }, 3000)
  }
  
  async showAdminLoading() {
    this.spinner.show()
    setTimeout(() => {
      this.router.navigate(['/Tabla_De_Usuarios']) 
      this.spinner.hide()
    }, 3000)
  }

  private updateScore(user_id) {
    // console.log(user_id)
    let numberOfuserRoutines = 0
    this.db.collection('routines').get().subscribe((resultado) => {
      resultado.docs.forEach((routineDocs) => {
        let routinesDocsData: any = routineDocs.data()
        if(routinesDocsData.userID == user_id) {
          numberOfuserRoutines++;
        }
      })
      for (let i = 0; i < numberOfuserRoutines; i++) {
        this.userRoutines[i] = new Array(4);
      }
    })

    this.db.collection('routines').get().subscribe((resultado) => {
      let i = 0
      resultado.docs.forEach((routineDocs) => {
        let routinesDocsData: any = routineDocs.data()
        if(routinesDocsData.userID == user_id) {
          this.userRoutines[i][0] = routinesDocsData.weekday
          this.userRoutines[i][1] = routinesDocsData.timetable
          this.userRoutines[i][2] = routinesDocsData.completed
          this.userRoutines[i++][3] = routineDocs.id
        }
      })
      // console.log(this.userRoutines)
      let aux = new Date().getDay() - 1;
      if(aux == -1) aux = 6
      this.weekday = aux
      let timeHours = Number(formatDate(new Date(), "H", 'en')); 
      let timeMinutes = Number(formatDate(new Date(), "m", 'en'));
      let endtime: any
      let nTimes: number = 0
      for (let i = 0; i < this.userRoutines.length; i++) {
        endtime = this.userRoutines[i][1].substring(this.userRoutines[i][1].lastIndexOf(":")-2)
        endtime = Number(endtime.substring(0, 2)) * 60 + Number(endtime.substring(3, 5))
        if(this.userRoutines[i][0] > this.weekday) {
          // console.log(this.map.indexWeekdayToWeekday.get(this.userRoutines[i][0]))
          this.db.collection('routines').doc(this.userRoutines[i][3]).update({
            completed: "N"
          })
        }
        if(this.userRoutines[i][0] == this.weekday && endtime > (timeHours * 60 + timeMinutes)) {
          // console.log(this.map.indexWeekdayToWeekday.get(this.userRoutines[i][0]) + endtime + " > " + timeHours + ":" + timeMinutes)
          this.db.collection('routines').doc(this.userRoutines[i][3]).update({
            completed: "N"
          })
        }
        // 
        if(this.userRoutines[i][0] < this.weekday && this.userRoutines[i][2] == 'N') {
          nTimes++;
          this.db.collection('routines').doc(this.userRoutines[i][3]).update({
            completed: "OK"
          })
        }
        if(this.userRoutines[i][0] == this.weekday && endtime < (timeHours * 60 + timeMinutes) && this.userRoutines[i][2] == 'N') {
          nTimes++;
          this.db.collection('routines').doc(this.userRoutines[i][3]).update({
            completed: "OK"
          })
        }
      }
      if(nTimes > 0) {
        this.db.collection('users').get().subscribe((resultado) => {
          resultado.docs.forEach((usersDocs) => {
            if(usersDocs.id == user_id) {
              let usersDocsData: any = usersDocs.data()
              let prevScore = usersDocsData.score
              prevScore -= (5 * nTimes)
              if(prevScore < 0) {
                prevScore = 0
              }
              console.log(prevScore)
              console.log(nTimes)
              this.db.collection('users').doc(user_id).update({
                score: prevScore
              })
            }
          })
        })
      }
    })
  }
}