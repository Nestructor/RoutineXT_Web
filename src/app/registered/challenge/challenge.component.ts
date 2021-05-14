import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  completeUserName: string
  userImg: any
  score: number;
  max_score: number
  completedChallenges: number = 0
  challenges: any = []
  today: string = formatDate(Date.now(), 'dd/MM/yyyy', 'en')
  
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
          this.score = items.score;
          this.max_score = items.max_score;
          if(items.email == 'routineXT_adm@outlook.com') this.router.navigate(['/Tabla_De_Retos']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })


  }

  ngOnInit(): void {
    this.db.collection('users').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        if(item.id == "ThuA1Pv5FYPXl81CkqWiTre2Ihh1") {
          let challengeData:any = item.data(); //Identificador del cliente
          let nChallenges = challengeData.nChallenges
          this.db.collection('challenges').get().subscribe((resultado) => {

            for (let i = 0; i < nChallenges; i++) {
              this.challenges[i] = new Array(7);
            }
      
            let i = 0
            resultado.docs.forEach((item) => {
              let challengeData:any = item.data(); //Identificador del cliente
              if(this.userID == challengeData.userID) {
                if(challengeData.completed != '') this.completedChallenges++;
                this.challenges[i][0] = challengeData.name
                this.challenges[i][1] = challengeData.type
                this.challenges[i][2] = challengeData.description
                this.challenges[i][3] = challengeData.necessaryScore
                this.challenges[i][4] = challengeData.difficulty
                this.challenges[i][5] = challengeData.completed
                this.challenges[i++][6] = challengeData.distance
              }
            })
            this.sort();
          })   
        }
      })
    })
    console.log(this.challenges.length)
  }

  private sort() {
    let aux: number;
    for (let k = 1; k < this.challenges.length; k++) {
      for (let i = 0; i < (this.challenges.length - k); i++) {
        if (this.challenges[i][3] > this.challenges[i+1][3]) {
          aux = this.challenges[i];
          this.challenges[i] = this.challenges[i+1];
          this.challenges[i+1] = aux;
        }
      }
    }
  }

  print() {
    window.print()
  }

  updateScore(challenge: any) {
    
    this.db.collection('challenges').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let challengeData:any = item.data();
        if(challengeData.userID == this.userID && challengeData.name == challenge[0]) {
          this.db.collection('challenges').doc(item.id).update({
            completed: this.today
          })
        }
      })
    })

    switch(challenge[4]) {
      case "Fácil":
        this.db.collection('users').doc(this.userID).update({
          score: this.score + 25,
          max_score:this.max_score + 25
        }).then((updated) => {
          window.location.reload()
        })
        break;
      case "Media":
        this.db.collection('users').doc(this.userID).update({
          score: this.score + 45,
          max_score:this.max_score + 45
        }).then((updated) => {
          window.location.reload()
        })
        break
      case "Difícil":
        this.db.collection('users').doc(this.userID).update({
          score: this.score + 75,
          max_score:this.max_score + 75
        }).then((updated) => {
          window.location.reload()
        })
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
