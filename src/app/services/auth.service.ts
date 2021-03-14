import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
 
@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth, 
    private router: Router) 
  { }

  async login(email: string, password: string) { 
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password)
    } catch(error) {
      console.log(error)
      return "error"
    }
  }

  async register(email: string, password: string) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password)
    } catch(error) {
      console.log(error)
      return "error"
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut()
      this.router.navigate(['/Iniciar_Sesion'])
    } catch(error) {
      console.log(error)
      return "error"
    }
  }

  async resetPassword(email: string):Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email)
    } catch(error) {
      console.log(error)
    }
  }

}