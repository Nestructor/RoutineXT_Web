import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private auth: AngularFireAuth) {

  }

  ngOnInit(): void {

  }

  logout() {
    this.auth.signOut();
  }

}
