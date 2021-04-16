import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  completeUserName: string
  userImg: any
  advice = new Array();
  practice = new Array();
  
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

    this.db.collection('advice').get().subscribe((resultado) => {
        let i = 0
        resultado.docs.forEach((doc) => {
          let adviceDocs:any = doc.data(); 
          this.advice[i++] = adviceDocs.advice
        })
        // this.advice.forEach(item => console.log(item))
    })

    this.db.collection('practice').get().subscribe((resultado) => {
      let i = 0
      resultado.docs.forEach((doc) => {
        let practiceDocs:any = doc.data(); 
        this.practice[i++] = practiceDocs.practice
      })
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
