import { inject} from '@angular/core';
import { CanActivate, Router} from '@angular/router';

export const AuthGuard = () =>{
  
  const router = inject(Router)

    if (localStorage.getItem('token')){
        return true
    }else{
        router.navigate(['/login'])
        return false;
    }
  
}
