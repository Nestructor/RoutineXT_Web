import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  resetForm: FormGroup;
  userID: string;
  name: string

  constructor(
    private authSrv: AuthService, 
    private fb: FormBuilder, 
    private router: Router,
    private db: AngularFirestore
  ) 
  { 
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      this.userID = user.uid
      this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
        let items: any = resultado.data()
        this.name = items.name;
      })
    })
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])]
    })
  }

  async resetPassword() {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 7000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    try {
      await this.authSrv.resetPassword(this.resetForm.get('email').value)
      .then((success) => {
        Toast.fire({
          icon: 'success',
          title: 'Le hemos enviado un correo de recuperación de la contraseña'
        })
      })
      .catch((error) => {
        Toast.fire({
          icon: 'error',
          title: '¡Oops! Ha ocurrido algún error al intentar enviarle un correo de recuperación de la contraseña'
        })
      })
      this.router.navigate(['/Iniciar_Sesion']) 
    } catch(error) {
      console.log(error)
    }
  }

}
