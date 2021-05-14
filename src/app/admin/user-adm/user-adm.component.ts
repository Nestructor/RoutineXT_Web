import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-adm',
  templateUrl: './user-adm.component.html',
  styleUrls: ['./user-adm.component.css']
})
export class UserAdmComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  name: string
  userImg: any
  users: any = []
  noData: boolean = false;
  modalRef: BsModalRef
  
  idModal: string
  nameModal: string;
  surnameModal: string;
  ageModal: number;
  emailModal: string;
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
    this.db.collection('users').get().subscribe((resultado) => {
      for (let i = 0; i < resultado.size-1; i++) {
        this.users[i] = new Array(6);
      }
      let i = 0
      resultado.docs.forEach((item) => {
        let userData:any = item.data();
        if(item.id != this.userID) {
          this.users[i][0] = item.id;
          this.users[i][1] = userData.name;
          this.users[i][2] = userData.surname;
          this.users[i][3] = userData.age;
          this.users[i][4] = userData.email;
          this.users[i++][5] = userData.score;
        }
      })
      if(this.users.length == 0) this.noData = true;
    })

  }

  openModal(modal: TemplateRef<any>, user) {
    this.idModal = user[0]
    this.nameModal =  user[1]
    this.surnameModal =  user[2]
    this.ageModal =  user[3]
    this.emailModal =  user[4]
    this.modalRef = this.modalService.show(modal);
  }

  checkModalValues() {
    let result: boolean = true;
    if( this.nameModal == "") result=false 
    if(this.surnameModal == "") result=false 
    if(this.ageModal < 18 || this.ageModal > 65) result=false
    if(!new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$', 'g').test(this.emailModal)) result = false;
    return result;
  }

  orderByAge() {
    let aux: number;
    for (let k = 1; k < this.users.length; k++) {
      for (let i = 0; i < (this.users.length - k); i++) {
        if (this.users[i][3] >= this.users[i+1][3]) {
          aux = this.users[i];
          this.users[i] = this.users[i+1];
          this.users[i+1] = aux;
        }
      }
    }
  }

  orderByScore() {
    let aux: number;
    for (let k = 1; k < this.users.length; k++) {
      for (let i = 0; i < (this.users.length - k); i++) {
        if (this.users[i][5] >= this.users[i+1][5]) {
          aux = this.users[i];
          this.users[i] = this.users[i+1];
          this.users[i+1] = aux;
        }
      }
    }
  }

  updateUser(id: string) {
    this.modalService.hide();
    this.db.collection('users').doc(id).update({
      name: this.nameModal,
      surname: this.surnameModal,
      age: this.ageModal,
      email: this.emailModal
    }).then((registered) => {
      this.toast.fire({
        icon: 'success',
        title: 'Usuario editado correctamente'
      })
    }).catch((error) => {
      this.toast.fire({
        icon: 'error',
        title: 'El usuario no ha podido ser editado'
      })
    })

    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i][0] == id) {
        this.users[i][1] = this.nameModal;
        this.users[i][2] = this.surnameModal;
        this.users[i][3] = this.ageModal;
        this.users[i][4] = this.emailModal;
      }
    }

  }

  deleteUser(id: string) {
    this.db.collection('users').doc(id).delete();
    let newUsers = []
    for (let i = 0; i < this.users.length-1; i++) {
      newUsers[i] = new Array(6)
    }

    let j = 0
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i][0] != id) newUsers[j++] = this.users[i];
    }
    this.users = newUsers
    if(this.users.length == 0) this.noData = true;

    //Delete challenges
    this.db.collection('challenges').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let challengeData:any = item.data();
        if(challengeData.userID == id) {
          this.db.collection('challenges').doc(item.id).delete();
        }
      })
    })

    //Delete routines
    this.db.collection('routines').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let routineData:any = item.data();
        if(routineData.userID == id) {
          this.db.collection('routines').doc(item.id).delete();
        }
      })
    })
    
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
