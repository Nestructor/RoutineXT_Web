import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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
  userID: string;
  name: string
  cookie_value: string = ''
  showCookieMessage: boolean;

  constructor (
    private  authSvc: AuthService, 
    private cookieSvc: CookieService,
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


