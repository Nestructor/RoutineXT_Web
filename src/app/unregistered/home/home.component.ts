import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public user$: Observable<any> = this.authSvc.afAuth.user
  isLogged: boolean = false
  cookie_value: string = ''
  showCookieMessage: boolean;

  constructor (
    private  authSvc: AuthService, 
    private cookieSvc: CookieService
  ) 
  { 
    this.user$.subscribe((user) => {
      console.log(user)
      this.isLogged = user != null ? true : false
    })
  }

  ngOnInit(): void {
    this.cookie_value = this.cookieSvc.get('RoutineXT_Cookie')
    this.showCookieMessage = this.cookie_value != '' ? false : true;
    console.log(this.showCookieMessage)
  }

  acceptCookies() {
    this.showCookieMessage = false;
    this.cookieSvc.set('RoutineXT_Cookie', 'GDPR', { expires: 3 });
  } 

  rejectCookies() {
    this.showCookieMessage = false;
    this.cookieSvc.delete('RoutineXT_Cookie');
  }

}


