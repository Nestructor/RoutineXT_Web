import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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


  constructor(
    private authSrv: AuthService, 
    private fb: FormBuilder, 
    private db: AngularFirestore,
    private router: Router) 
  { 
    this.user$.subscribe((user) => {
      console.log(user)
      this.isLogged = user != null ? true : false
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
  };

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
      max_score: 0
    }).then((registered)=> {
      console.log("Registro creado")
    })

    //Añadir primeros 5 retos

    this.db.collection('challenges').add({
        completed: "",
        name: "Este trote empieza a complicarse",
        type: "Atletismo II",
        description: "Nos situaremos en la avenida marítima e iremos trotando ida y vuelta desde la Plaza de Santa Isabel hasta llegar hasta la Playa de la Laja (10 Km en 2 horas).",
        necessaryScore: 200,
        difficulty: "Difícil",
        userID: uid
      })

    this.db.collection('challenges').add({
      completed: "",
      name: "Un buen pedaleo",
      type: "Ciclismo I",
      description: "Nos situaremos en la avenida marítima e iremos pedaleando ida y vuelta en bicicleta desde la Plaza de Santa Isabel pasando por el Museo Élder, y siguiendo la ruta hasta llegar hasta el Monumento 'El Atlante' (18 Km en 1:30 horas).",
      necessaryScore: 145,
      difficulty: "Media",
      userID: uid
    })

    this.db.collection('challenges').add({
      completed: "",
      name: "Hola Tejeda, quiero decir Artenara",
      type: "Senderismo I",
      description: "Nos situaremos en el aparcamiento situado en la parte trasera del Parador Nacional de La Cruz de Tejeda. Por un lado del Parador, comenzaremos a caminar por un sendero señalizado hasta llegar hasta Artenara siguiendo las indicaciones de la ruta (9 Km en 3 horas).",
      necessaryScore: 100,
      difficulty: "Media",
      userID: uid
    })

    this.db.collection('challenges').add({
      completed: "",
      name: "¿Estás visible Barra?",
      type: "Natación I",
      description: "Nos situaremos en la playa de las Canteras por la altura del hotel 'Reina Isabel' y tendremos que ir y venir nadando hasta la Barra un total de 3 veces sin hacer paradas. Es necesario que la marea esté baja (1,2 Km en 1 hora).",
      necessaryScore: 65,
      difficulty: "Fácil",
      userID: uid
    })

    this.db.collection('challenges').add({
      completed: "",
      name: "¡Comenzamos a trotar!",
      type: "Atletismo I",
      description: "En este primer reto, tendremos que ir y venir trotando por la avenida marítima desde la plaza de Santa Isabel hasta el Monumento a la Vela Latina en San Telmo sin parar en ningún momento (4 Km en 1 hora).",
      necessaryScore: 35,
      difficulty: "Fácil",
      userID: uid
    })

  }

}
