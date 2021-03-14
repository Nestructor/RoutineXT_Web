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
    // console.log('Form ->', this.registerForm.value)
    //Añadir datos de usuario a Authentication
    const {email, password} = this.registerForm.value
    try {
      const user =  await this.authSrv.register(email, password)
      if(user != "error") {
        console.log(user)
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
    this.db.collection('users').add({
      name: this.registerForm.get('name').value,
      surname: this.registerForm.get('surname').value,
      age: this.registerForm.get('age').value,
      email: this.registerForm.get('email').value,
      profile: "https://firebasestorage.googleapis.com/v0/b/routinext.appspot.com/o/profile_Images%2Fcoche.jpg?alt=media&token=0825fed0-e7a6-4afc-aebe-09f1433c4bcb"
    }).then((registered)=> {
      console.log("Registro creado")
    })
  }

  

}
