import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authSrv: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async onRegister() {
    // console.log('Form->', this.registerForm.value)
    const {email, password} = this.registerForm.value
    try {
      const user =  await this.authSrv.register(email, password)
      if(user) this.router.navigate(['/Test'])
    } catch(error) {
      console.log(error)
    }
  }

}
