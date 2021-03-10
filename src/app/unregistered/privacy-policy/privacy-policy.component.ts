import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false

  constructor(private authSrv: AuthService) {
    this.user$.subscribe((user) => {
      console.log(user)
      this.isLogged = user != null ? true : false
    })
  }

  ngOnInit(): void {
  }

}
