import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  validData: boolean = true
  
  user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  userID: string;
  name: string
  
  constructor(
    private authSrv: AuthService, 
    private router: Router, 
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private db: AngularFirestore
  ) 
  { 
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if(this.isLogged) {
        this.userID = user.uid
        this.db.collection('users').doc(this.userID).get().subscribe((resultado) => {
          let items: any = resultado.data()
          this.name = items.name;
        })
      }
    })
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    //console.log('Form->', this.loginForm.value)
    const {email, password} = this.loginForm.value
    try {
      const login =  await this.authSrv.login(email, password)
      if(login != "error") {
        email == 'routineXT_adm@outlook.com' ? this.showAdminLoading() : this.showLoading()
      } else {
        this.validData = false
        this.loginForm.reset()
      }
    } catch(error) {
      console.log(error)
    }
  }

  async showLoading() {
    this.spinner.show()
    setTimeout(() => {
      this.router.navigate(['/Plan_De_Entrenamiento']) 
      this.spinner.hide()
    }, 3000)
  }
  
  async showAdminLoading() {
    this.spinner.show()
    setTimeout(() => {
      this.router.navigate(['/Tabla_De_Usuarios']) 
      this.spinner.hide()
    }, 3000)
  }

}

