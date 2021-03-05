import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private authSrv: AuthService, 
    private router: Router, 
    private fb: FormBuilder) 
  {
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if (this.isLogged) {
        this.router.navigate(['/Test']) 
      }
    })
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onLogin() {
    //console.log('Form->', this.loginForm.value)
    const {email, password} = this.loginForm.value
    try {
      
      const login =  await this.authSrv.login(email, password)
      if(login != "error") {
        this.router.navigate(['/Test']) 
      } else {
        this.validData = false
        this.loginForm.reset()
      }
    } catch(error) {
      console.log(error)
    }
  }

}
