import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Observable } from 'rxjs';
import { MenuValidateRequest } from './core/models/Layout/request/menu-validate.request';
import { GetMenuValidateByEmailUseCase } from './core/usecase/layout/get_menu_validate_by_email.usecase';

@Injectable({
  providedIn: 'root'
})
export class MaslGuard implements CanActivate {

  constructor(
    private msalService: MsalService,
    private router: Router,
    private _getMenuValidateByEmail: GetMenuValidateByEmailUseCase,
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    if (!!localStorage.getItem('token')) {
      const param: MenuValidateRequest ={
        user_email:localStorage.getItem('username'),
        route: state.url.split("/").pop()
      }
      if(param.route!="home"){
        const  response:any = await this._getMenuValidateByEmail.execute(param)
      if (response.data>0) {
        return true;
      } else {
        this.router.navigate(['/admin/home']);
        return false;
      }
      }else{

        return true;
      }

      // if (response===0) {
      //   console.log('sin acceesooo')
      //   this.router.navigate(['/admin/home']);
      //   const sdad=this.router.navigate(['/admin/home']);

      //   return false;
      // }
      // else{


      // }
       // Usuario autenticado, permite el acceso a la ruta protegida
    } else {
        this.router.navigate(['/login']); // Redirige al componente de inicio de sesión
        return false; // Bloquea el acceso a la ruta protegida
      }
  }


}
