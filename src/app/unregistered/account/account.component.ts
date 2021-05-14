import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  registerForm: FormGroup;
  checked: boolean = false
  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  userID: string;
  name: string
  challenges: any = []

  constructor(
    private authSrv: AuthService, 
    private fb: FormBuilder, 
    private db: AngularFirestore,
  ) 
  { 
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if(this.isLogged)
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name;
        })
    })
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      age: ['', Validators.compose([
        Validators.required, 
        Validators.min(18),
        Validators.max(65)
      ])],
      email: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])],
      password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(16)
      ])],
      confirmPassword: [''], 
    }, 
    {
      validator: this.passwordMatchValidator
    })

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
      
    })

  };

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
    console.log(this.challenges)
  }

  private passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; 
    const confirmPassword: string = control.get('confirmPassword').value; 
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ NoPasswordMatch: true });
    }
  }

  onCheckboxChange(e) {  
    this.checked = e.target.checked ? true : false
  }

  async onRegister() {
    let uid;
    // console.log('Form ->', this.registerForm.value)
    //Añadir datos de usuario a Authentication
    const {email, password} = this.registerForm.value
    try {
      const user =  await this.authSrv.register(email, password)
      if(user != "error") {
        uid = user.user.uid
        await this.authSrv.logout()
        setTimeout(function() {
          Swal.fire({
            title: 'Enhorabuena',
            text: 'Se ha registrado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
        }, 1000);

        //Añadir datos de usuario a cloudFirestore
        this.db.collection('users').doc(uid).set({
          name: this.registerForm.get('name').value,
          surname: this.registerForm.get('surname').value,
          age: this.registerForm.get('age').value,
          email: this.registerForm.get('email').value,
          profile: "https://firebasestorage.googleapis.com/v0/b/routinext.appspot.com/o/profile_Images%2Fdefault_profile_photo.png?alt=media&token=8d696e13-a7d6-47ca-bc9c-384d4e1c0719",
          score: 0,
          routines: 0,
          exercises: 0,
          challenges: 0,
          max_score: 0,
          trainingPlanCancelled: false
        }).then((registered)=> {
          console.log("Registro creado")
          for (let i = 0; i < this.challenges.length; i++) {
            this.db.collection('challenges').add({
              name: this.challenges[i][1],
              type: this.challenges[i][2],
              necessaryScore: this.challenges[i][3],
              difficulty: this.challenges[i][4],
              description: this.challenges[i][5],
              distance: this.challenges[i][6],
              completed: "",
              userID: uid
            })
          }
        })

      } else {
        Swal.fire({
          title: '¡Oops! Ha ocurrido un error',
          text: 'Es posible que el correo introducido ya esté registrado en el sistema',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch(error) { 
      console.log(error)
    }
    
  }
}
