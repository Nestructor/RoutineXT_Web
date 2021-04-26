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
  completedChallenges: number = 0
  challenges: any = []
  
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
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })

    for (let i = 0; i < 5; i++) {
      this.challenges[i] = new Array(6);
    }

  }

  ngOnInit(): void {    
    this.db.collection('challenges').get().subscribe((resultado) => {
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
          this.challenges[i++][5] = challengeData.completed
        }
      })
      this.sort();
    })   
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
