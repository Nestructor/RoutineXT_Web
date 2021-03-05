import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
 
@Injectable()
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  async login(email: string, password: string) { 
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password)
    } catch(error) {
      // console.log(error)
      return "error"
    }
  }

  async register(email: string, password: string) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password)
    } catch(error) {
      // console.log(error)
      return "error"
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut()
    } catch(error) {
      // console.log(error)
      return "error"
    }
  }

  

}