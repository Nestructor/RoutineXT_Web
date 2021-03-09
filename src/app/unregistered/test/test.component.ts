import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  public isLogged = false
  public user$: Observable<any> = this.authSvc.afAuth.user
  loading: boolean = true

  constructor(private  authSvc: AuthService, private router: Router, private spinner: NgxSpinnerService) {
    this.user$.subscribe((user) => {
      this.isLogged = user != null ? true : false
      if (!this.isLogged) {
        this.router.navigate(['/Iniciar_Sesion']) 
      } else {
        this.spinner.show()
        setTimeout(() => {
          this.spinner.hide()
          this.loading = false
        }, 3000)
      }
    })
  }

  ngOnInit() {
  }

  async onLogout() {
    try {
      await this.authSvc.logout()
      this.router.navigate(['/Iniciar_Sesion'])
    } catch(error) {
      console.log(error)
    }
  }

}
