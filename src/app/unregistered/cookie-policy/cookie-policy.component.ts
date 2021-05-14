import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.css']
})
export class CookiePolicyComponent implements OnInit {

  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  userID: string;
  name: string

  constructor(
    private authSrv: AuthService,
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
  }

}
