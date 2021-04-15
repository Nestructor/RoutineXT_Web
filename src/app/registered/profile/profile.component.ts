import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  loading: boolean = true
  userID: string
  completeUserName: string
  name: string
  surname: string
  email: string
  age: number
  score: number
  max_score: number
  challenges: number
  routines: number
  exercises: number

  userImg: any
  urlImagen: string = ''
  uploadPercentage: number = 0;
  
  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
        let items: any = resultado.data()
        this.name = items.name
        this.surname = items.surname
        this.email = items.email
        this.age = items.age
        this.score = items.score
        this.max_score = items.max_score
        this.challenges = items.challenges
        this.routines = items.routines
        this.exercises = items.exercises
        this.completeUserName = items.name + " " + items.surname
        this.userImg = items.profile
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
