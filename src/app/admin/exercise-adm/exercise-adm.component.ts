import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-exercise-adm',
  templateUrl: './exercise-adm.component.html',
  styleUrls: ['./exercise-adm.component.css']
})
export class ExerciseAdmComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  name: string
  userImg: any
  exercises: any = []
  noData: boolean = false;
  modalRef: BsModalRef
  
  idModal: string = ''
  exerciseModal: string  = '';
  typeModal: string = '';
  descriptionModal: string  = '';
  toast: any

  constructor(
    private authSvc: AuthService, 
    private router: Router, 
    private db: AngularFirestore,
    private modalService: BsModalService
  ) {
    this.user$.subscribe((user) => {
      try {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name
          this.userImg = items.profile
          if(items.email != 'routineXT_adm@outlook.com') this.router.navigate(['/Plan_De_Entrenamiento']) 
        })
      } catch(error) {
        this.router.navigate(['/Iniciar_Sesion']) 
      }
    })

    this.toast = Swal.mixin({
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

  }

  ngOnInit(): void {
    this.db.collection('exercises').get().subscribe((resultado) => {
      for (let i = 0; i < resultado.size; i++) {
        this.exercises[i] = new Array(4);
      }
      let i = 0
      resultado.docs.forEach((item) => {
        let exerciseData:any = item.data();
        this.exercises[i][0] = item.id;
        this.exercises[i][1] = exerciseData.name;
        this.exercises[i][2] = exerciseData.type;
        this.exercises[i++][3] = exerciseData.description;
      })
      if(this.exercises.length == 0) this.noData = true;
      console.log("Antes de añadir: " + this.exercises.length)
    })
    
  }

  openModal(modal: TemplateRef<any>, user) {
    this.idModal = user[0]
    this.exerciseModal = user[1]
    this.typeModal = user[2]
    this.descriptionModal = user[3]
    this.modalRef = this.modalService.show(modal);
  }

  openModal_2(modal: TemplateRef<any>) {
    this.exerciseModal = ''
    this.typeModal = ''
    this.descriptionModal = ''
    this.modalRef = this.modalService.show(modal);
  }

  checkModalValues() {
    let result: boolean = true;
    if(this.exerciseModal == "") result=false 
    if(this.typeModal == "") result=false 
    if(this.descriptionModal == "") result=false
    return result;
  }

  orderByCategory() {
    let flexArray = []
    let abdArray = []
    let glutArray = []
    let pierArray = []
    let brazArray = []
    let flex = 0, abd = 0, glut = 0, pier = 0, braz = 0;

    for (let i = 0; i < this.exercises.length; i++) {
      switch(this.exercises[i][2]) {
        case 'Flexibilidad':
          flexArray[flex++] = this.exercises[i].slice()
          break
        case 'Abdominales':
          abdArray[abd++] = this.exercises[i].slice()
          break
        case 'Glúteos':
          glutArray[glut++] = this.exercises[i].slice()
          break
        case 'Piernas':
          pierArray[pier++] = this.exercises[i].slice()
          break
        case 'Brazos':
          brazArray[braz++] = this.exercises[i].slice()
          break
      }
    }

    let j = 0;
    for (let i = 0; i < flexArray.length; i++) {
      this.exercises[j++] = flexArray[i]
    }
    for (let i = 0; i < abdArray.length; i++) {
      this.exercises[j++] = abdArray[i]
    }
    for (let i = 0; i < glutArray.length; i++) {
      this.exercises[j++] = glutArray[i]
    }
    for (let i = 0; i < pierArray.length; i++) {
      this.exercises[j++] = pierArray[i]
    }
    for (let i = 0; i < brazArray.length; i++) {
      this.exercises[j++] = brazArray[i]
    }
  }

  addExercise() {
    this.modalService.hide();
    this.db.collection('exercises').add({
      name: this.exerciseModal,
      type: this.typeModal,
      description: this.descriptionModal,
      image: "https://firebasestorage.googleapis.com/v0/b/routinext.appspot.com/o/profile_Images%2Fdefault_profile_photo.png?alt=media&token=8d696e13-a7d6-47ca-bc9c-384d4e1c0719"
    }).then((registered) => {
      this.db.collection('exercises').get().subscribe((resultado) => {
        for (let i = 0; i < resultado.size; i++) {
          this.exercises[i] = new Array(4);
        }
        let i = 0
        resultado.docs.forEach((item) => {
          let exerciseData:any = item.data();
          this.exercises[i][0] = item.id;
          this.exercises[i][1] = exerciseData.name;
          this.exercises[i][2] = exerciseData.type;
          this.exercises[i++][3] = exerciseData.description;
        })
        if(this.exercises.length == 1)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
      })
      this.toast.fire({
        icon: 'success',
        title: 'Ejercicio añadido correctamente'
      })
    }).catch((error) => {
      this.toast.fire({
        icon: 'error',
        title: 'El ejercicio no ha podido ser añadido'
      })
    })
  }

  updateExercise(id: string) {
    this.modalService.hide();
    this.db.collection('exercises').doc(id).update({
      name: this.exerciseModal,
      type: this.typeModal,
      description: this.descriptionModal,
    }).then((registered) => {
      this.toast.fire({
        icon: 'success',
        title: 'Ejercicio editado correctamente'
      })
    }).catch((error) => {
      this.toast.fire({
        icon: 'error',
        title: 'El ejercicio no ha podido ser editado'
      })
    })

    for (let i = 0; i < this.exercises.length; i++) {
      if(this.exercises[i][0] == id) {
        this.exercises[i][1] = this.exerciseModal;
        this.exercises[i][2] = this.typeModal;
        this.exercises[i][3] = this.descriptionModal;
      }
    }

  }

  deleteUser(id: string) {
    this.db.collection('exercises').doc(id).delete();
    let newUsers = []
    for (let i = 0; i < this.exercises.length-1; i++) {
      newUsers[i] = new Array(4)
    }

    let j = 0
    for (let i = 0; i < this.exercises.length; i++) {
      if(this.exercises[i][0] != id) newUsers[j++] = this.exercises[i];
    }
    this.exercises = newUsers
    if(this.exercises.length == 0) this.noData = true;
  }

  async onLogout() {
    try {
      await this.authSvc.logout()
      this.router.navigate(['/Iniciar_Sesion'])
      this.toast.fire({
        icon: 'success',
        title: 'Sesión cerrada correctamente'
      })
    } catch(error) {
      console.log(error)
    }
  }

}
