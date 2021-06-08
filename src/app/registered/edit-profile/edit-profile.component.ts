import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

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

  dataForm: FormGroup
  validData: boolean = true
  userRanking: number;
  usersData = []
  modalRef: BsModalRef
  
  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder,
    private modalService: BsModalService
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
          if(items.email == 'routineXT_adm@outlook.com') this.router.navigate(['/Editar_Perfil_Adm']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })
  }

  watchVideo(modal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modal);
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      userName: ['', Validators.required],
      userSurname: ['', Validators.required],
      userEmail: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])],
      userAge: ['', Validators.compose([
        Validators.required, 
        Validators.min(18),
        Validators.max(65)
      ])]
    });

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
            this.router.navigate(['/Perfil'])
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

    const {userName, userSurname, userEmail, userAge} = this.dataForm.value
    console.log(userName + " " + userEmail)
    this.db.collection('users').doc(this.userID).update({
      name: userName,
      surname: userSurname,
      email: userEmail,
      age: userAge
    }).then((updated) => {
      this.router.navigate(['/Perfil'])
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
