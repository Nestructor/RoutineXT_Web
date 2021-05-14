import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile-adm',
  templateUrl: './edit-profile-adm.component.html',
  styleUrls: ['./edit-profile-adm.component.css']
})
export class EditProfileAdmComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  loading: boolean = true
  userID: string
  name: string
  email: string

  userImg: any
  urlImagen: string = ''
  uploadPercentage: number = 0;

  dataForm: FormGroup
  validData: boolean = true
  
  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name
          this.email = items.email
          this.userImg = items.profile
          if(items.email != 'routineXT_adm@outlook.com') this.router.navigate(['/Plan_De_Entrenamiento']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])]
    });
  }

  updateImg(evento) {
    if(evento.target.files.length > 0) {
      let archivo = evento.target.files[0]; 
      let nombre = archivo.name.toString();
      let ruta = 'profile_Images/' + nombre; 
      const ref = this.storage.ref(ruta) 
      const tarea = ref.put(archivo) 
      tarea.then((objeto) => {
        console.log('Imagen subida'); 
        ref.getDownloadURL().subscribe((url) => { 
          this.db.collection('users').doc(this.userID).update({
            profile: url
          })
        })
      })
      tarea.percentageChanges().subscribe((porcentaje) => {
        // console.log(porcentaje)
        this.uploadPercentage = parseInt(porcentaje.toString()) 
        if(this.uploadPercentage == 100) {
          setTimeout(() => {
            this.router.navigate(['/Perfil_Adm'])
          }, 2000)
          // setInterval(() => window.location.reload(), 1000);
        }
      })
    }
  }

  async onUpdate() {
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

    const {userName, userEmail} = this.dataForm.value
    this.db.collection('users').doc(this.userID).update({
      name: userName,
      email: userEmail,
    }).then((updated) => {
      this.router.navigate(['/Perfil_Adm'])
      Toast.fire({
        icon: 'success',
        title: 'Datos actualizados correctamente'
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
