import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AuthResponseData } from '../models/authResponseData';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth:AuthResponseData|null=null;
  public isLoggedin=false;
  public onUserStatusChange=new EventEmitter<boolean>();

  constructor(private http:HttpClient, private router:Router) { 

  }
// Prisijungimas kai prisijungiame ivede el pasta ir slaptazodi 
  public register(email:string, password:string, newUser:boolean){
    const method=(newUser)?'signUp':'signInWithPassword';
    
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:'+method+'?key=AIzaSyArSjqgr-2fcVvaWIYgnE78BtxdRwAWv8c',{
      email:email,
      password:password,
      returnSecureToken:true
    }).pipe(tap( (response)=>{
      this.auth=response;
      this.isLoggedin=true;
      // Issaugome duomenis prisijungimo 
      localStorage.setItem('user', JSON.stringify(this.auth));

      this.onUserStatusChange.emit(true);
    }));
  }

  // Prisijungimas panaudojant duomenis is localstorage
  public autoLogin(){
    let user = localStorage.getItem('user');
    // patikriname ar esame prisijunge
    if(user != null) {
      this.auth = JSON.parse(user);
      this.isLoggedin = true;
      this.onUserStatusChange.emit(true);
    }
  }


  // Atsijungiame paspaude mygtuka atsijungti 
  public logout(){
    this.isLoggedin=false;
    this.auth=null;
    // istriname prisijungimo duomenis 
    localStorage.removeItem('user');
    this.onUserStatusChange.emit(false);
    this.router.navigate(['/']);
  }
}
