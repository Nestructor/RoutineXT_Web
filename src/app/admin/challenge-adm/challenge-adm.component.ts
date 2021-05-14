import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-challenge-adm',
  templateUrl: './challenge-adm.component.html',
  styleUrls: ['./challenge-adm.component.css']
})
export class ChallengeAdmComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  userID: string
  name: string
  userImg: any
  challenges: any = []
  noData: boolean = false;
  modalRef: BsModalRef
  
  idModal: string = ''
  challengeModal: string  = '';
  typeModal: string = '';
  scoreModal: number;
  difficultyModal: string = '';
  descriptionModal: string  = '';
  distanceModal: string  = '';
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
    this.db.collection('challenges').get().subscribe((resultado) => {
      for (let i = 0; i < resultado.size; i++) {
        this.challenges[i] = new Array(6);
      }
      let i = 0
      resultado.docs.forEach((item) => {
        let exerciseData:any = item.data();
        this.challenges[i][0] = item.id;
        this.challenges[i][1] = exerciseData.name;
        this.challenges[i][2] = exerciseData.type;
        this.challenges[i][3] = exerciseData.necessaryScore;
        this.challenges[i][4] = exerciseData.difficulty;
        this.challenges[i][5] = exerciseData.description;
        this.challenges[i++][6] = exerciseData.distance;
      })
      this.removeRepeatedChallenges();
      if(this.challenges.length == 0) this.noData = true;
      // console.log("Antes de añadir: " + this.challenges.length)
      // console.log(this.challenges)
    })
    
  }

  private removeRepeatedChallenges() {
    let newChallenges = []
    if(this.challenges.length > 0) {
      newChallenges.push(this.challenges[0])
      let k = 1;
      loop: for (let i = 1; i < this.challenges.length; i++) {
        for (let j = 0; j < newChallenges.length; j++) {
          if(this.challenges[i][1] == newChallenges[j][1]) continue loop;
          if(j == newChallenges.length-1) newChallenges[k++] = this.challenges[i];
        }
      }
      this.challenges = newChallenges
    }
  }

  openModal(modal: TemplateRef<any>, challenge) {
    this.idModal = challenge[0]
    this.challengeModal = challenge[1]
    this.typeModal = challenge[2]
    this.scoreModal = challenge[3]
    this.difficultyModal = challenge[4]
    this.descriptionModal = challenge[5]
    this.distanceModal = challenge[6]
    this.modalRef = this.modalService.show(modal);
  }

  openModal_2(modal: TemplateRef<any>) {
    this.challengeModal = ''
    this.typeModal = ''
    this.scoreModal = 0
    this.difficultyModal = ''
    this.descriptionModal = ''
    this.distanceModal = ''
    this.modalRef = this.modalService.show(modal);
  }

  checkModalValues() {
    let result: boolean = true;
    if(this.challengeModal == "") result=false 
    if(this.typeModal == "") result=false 
    if(this.scoreModal < 1) result=false 
    if(this.difficultyModal == "") result=false
    if(this.descriptionModal == "") result=false
    if(this.distanceModal == "") result=false
    return result;
  }

  orderByCategory() {
    let sendArray = []
    let natArray = []
    let atletArray = []
    let ciclisArray = []
    let send = 0, nat = 0, atlet = 0, ciclis = 0;

    for (let i = 0; i < this.challenges.length; i++) {
      switch(this.challenges[i][2]) {
        case 'Senderismo':
          sendArray[send++] = this.challenges[i].slice()
          break
        case 'Atletismo':
          natArray[nat++] = this.challenges[i].slice()
          break
        case 'Natación':
          atletArray[atlet++] = this.challenges[i].slice()
          break
        case 'Ciclismo':
          ciclisArray[ciclis++] = this.challenges[i].slice()
          break
      }
    }

    let j = 0;
    for (let i = 0; i < sendArray.length; i++) {
      this.challenges[j++] = sendArray[i]
    }
    for (let i = 0; i < natArray.length; i++) {
      this.challenges[j++] = natArray[i]
    }
    for (let i = 0; i < atletArray.length; i++) {
      this.challenges[j++] = atletArray[i]
    }
    for (let i = 0; i < ciclisArray.length; i++) {
      this.challenges[j++] = ciclisArray[i]
    }

  }

  orderByScore() {
    let aux: number;
    for (let k = 1; k < this.challenges.length; k++) {
      for (let i = 0; i < (this.challenges.length - k); i++) {
        if (this.challenges[i][3] >= this.challenges[i+1][3]) {
          aux = this.challenges[i];
          this.challenges[i] = this.challenges[i+1];
          this.challenges[i+1] = aux;
        }
      }
    }
  }

  addChallenge() {
    this.modalService.hide();
    this.db.collection('users').get().subscribe((resultado) => {
      resultado.docs.forEach((item) => {
        let items: any = item.data()
        if(items.email != 'routineXT_adm@outlook.com') {
          this.db.collection('challenges').add({
            name: this.challengeModal,
            type: this.typeModal,
            necessaryScore: this.scoreModal,
            difficulty: this.difficultyModal,
            description: this.descriptionModal,
            distance: this.distanceModal,
            completed: "",
            userID: item.id
          }).then((registered) => {
            this.db.collection('challenges').get().subscribe((resultado) => {
              for (let i = 0; i < resultado.size; i++) {
                this.challenges[i] = new Array(6);
              }
              let i = 0
              resultado.docs.forEach((item) => {
                let challengeData:any = item.data();
                this.challenges[i][0] = item.id;
                this.challenges[i][1] = challengeData.name;
                this.challenges[i][2] = challengeData.type;
                this.challenges[i][3] = challengeData.necessaryScore;
                this.challenges[i][4] = challengeData.difficulty;
                this.challenges[i][5] = challengeData.description;
                this.challenges[i++][6] = challengeData.distance;
              })
              this.removeRepeatedChallenges();
              if(this.challenges.length == 1)
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
        } else {
          this.db.collection('users').doc(item.id).update({
            nChallenges: items.nChallenges + 1
          })
        }
      })
  })
}

  updateChallenge(id: string) {
    this.modalService.hide();
    this.db.collection('users').get().subscribe((resultado1) => {
      resultado1.docs.forEach((itemUser) => {
        let itemsUserData: any = itemUser.data()
        if(itemsUserData.email != 'routineXT_adm@outlook.com') {
          this.db.collection('challenges').get().subscribe((resultado2) => {
            resultado2.docs.forEach((itemChallenge) => {
              let itemChallengeData: any = itemChallenge.data()
              if(itemChallengeData.userID == itemUser.id && itemChallengeData.name == this.challengeModal) {
                this.db.collection('challenges').doc(itemChallenge.id).update({
                  name: this.challengeModal,
                  type: this.typeModal,
                  necessaryScore: this.scoreModal,
                  difficulty: this.difficultyModal,
                  description: this.descriptionModal,
                  distance: this.distanceModal
                }).then((registered) => {
                  this.toast.fire({
                    icon: 'success',
                    title: 'Reto editado correctamente'
                  })
                }).catch((error) => {
                  this.toast.fire({
                    icon: 'error',
                    title: 'El reto no ha podido ser editado'
                  })
                })
              }
            })
          })
        }
      })
    })
    for (let i = 0; i < this.challenges.length; i++) {
      if(this.challenges[i][0] == id) {
        this.challenges[i][1] = this.challengeModal;
        this.challenges[i][2] = this.typeModal;
        this.challenges[i][3] = this.scoreModal;
        this.challenges[i][4] = this.difficultyModal;
        this.challenges[i][5] = this.descriptionModal;
        this.challenges[i][6] = this.distanceModal;
      }
    }

  }

  deleteChallenge(challenge) {
    this.db.collection('users').get().subscribe((resultado1) => {
      resultado1.docs.forEach((itemUser) => {
        let itemsUserData: any = itemUser.data()
        if(itemsUserData.email != 'routineXT_adm@outlook.com') {
          this.db.collection('challenges').get().subscribe((resultado2) => {
            resultado2.docs.forEach((itemChallenge) => {
              let itemChallengeData: any = itemChallenge.data()
              if(itemChallengeData.userID == itemUser.id && itemChallengeData.name == challenge[1]) {
                this.db.collection('challenges').doc(itemChallenge.id).delete();
              }
            })
          })
        } else {
          this.db.collection('users').doc(itemUser.id).update({
            nChallenges: itemsUserData.nChallenges - 1
          })
        }
      })
    })
    let newUsers = []
    for (let i = 0; i < this.challenges.length-1; i++) {
      newUsers[i] = new Array(5)
    }

    let j = 0
    for (let i = 0; i < this.challenges.length; i++) {
      if(this.challenges[i][0] != challenge[0]) newUsers[j++] = this.challenges[i];
    }
    this.challenges = newUsers
    if(this.challenges.length == 0) this.noData = true;
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
