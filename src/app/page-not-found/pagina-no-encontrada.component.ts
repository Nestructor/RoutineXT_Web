import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pagina-no-encontrada',
  templateUrl: './pagina-no-encontrada.component.html',
  styleUrls: ['./pagina-no-encontrada.component.css']
})
export class PaginaNoEncontradaComponent implements OnInit {

  public user$: Observable<any> = this.authSrv.afAuth.user
  isLogged: boolean = false
  startTime: Date = new Date();
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

  verifyTime() {
    console.log(this.startTime)
  }

  ngOnInit(): void {
  }

}
