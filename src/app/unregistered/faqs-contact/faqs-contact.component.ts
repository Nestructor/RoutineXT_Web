import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faqs-contact',
  templateUrl: './faqs-contact.component.html',
  styleUrls: ['./faqs-contact.component.css']
})

export class FaqsContactComponent implements OnInit {

  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  registerForm: FormGroup;
  checked: boolean = false
  

  constructor(private authSrv: AuthService, private fb: FormBuilder) {
    this.user$.subscribe((user) => {
      console.log(user)
      this.isLogged = user != null ? true : false
    })
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ])],
      message: ['', Validators.required ]
    })
  }

  onCheckboxChange(e) {  
    this.checked = e.target.checked ? true : false
  }

  sendEmail() {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const templateParams = {
      name: this.registerForm.get('name').value,
      from_name: this.registerForm.get('email').value,
      message: this.registerForm.get('message').value,
      reply_to: this.registerForm.get('email').value
    };

    emailjs.send('service_1u7l7cw','template_rl1ubl5', templateParams, 'user_SCdzq1A51qGu85qIZrtba')
      .then((result: EmailJSResponseStatus) => {
        this.registerForm.reset()
        Toast.fire({
          icon: 'success',
          title: 'Hemos recibido su mensaje correctamente'
        })
      }, (error) => {
        Toast.fire({
          icon: 'error',
          title: '¡Oops, no hemos podido recibir su mensaje!'
        })
      });
  }

}

