import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-adm',
  templateUrl: './profile-adm.component.html',
  styleUrls: ['./profile-adm.component.css']
})
export class ProfileAdmComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  loading: boolean = true
  userID: string
  completeUserName: string
  name: string
  email: string

  userImg: any
  urlImagen: string = ''
  uploadPercentage: number = 0;
  
  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name
          this.email = items.email
          this.completeUserName = items.name + " " + items.surname
          this.userImg = items.profile
          if(items.email != 'routineXT_adm@outlook.com') this.router.navigate(['/Plan_De_Entrenamiento']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })
  }

  ngOnInit() {
    
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
