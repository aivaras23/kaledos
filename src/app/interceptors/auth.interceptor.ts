import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class authInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptorius paleistas');
    // Patiriname ar esame prisijunge
    if(this.authService.auth != null){
         // Sukuriam kopija requesto
      let newReq = req.clone({
      // i requesta idedame nauja pametra (auth ir token)
      params:req.params.append('auth',this.authService.auth.idToken)
    })
    // Perduodame modifikuota requesta
    return next.handle(newReq);
    }
   

    
    // perduodame ne modifikuota requesta 
    return next.handle(req);
   
  }
  
}

// ng g interceptor interceptors/auth