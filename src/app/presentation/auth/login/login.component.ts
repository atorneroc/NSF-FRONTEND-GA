import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CompanyName } from 'src/app/common/helpers/enums/companies-name.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit
{
  logoScharff : string;
  isAuth : boolean = false;
  constructor(
    private router: Router,
    private msalService: MsalService
  ) {}

  ngOnInit(): void {
    // this.login();
      this.handleRedirectPromise();
      this.logoScharff = CompanyName.SLI
      if (this.isLoggedIn()) {
        this.router.navigate(['/admin']);
      }
  }
  handleRedirectPromise(): void {

    this.msalService.instance
      .handleRedirectPromise()
      .then((res) => {
        if (res && res.account) {
          this.msalService.instance.setActiveAccount(res.account);
          // const [userName]=res.account.username.split('@');
          localStorage.setItem('username', res.account.username);
          localStorage.setItem('name', res.account.name);
          localStorage.setItem('token', res.accessToken);
          this.router.navigate(['/admin']);
        }else{
          this.login()
        }
      })
      .catch((error) => {
        console.error('Error handling redirect promise:', error);
      });
  }

  isLoggedIn(): boolean {
    return !!this.msalService.instance.getActiveAccount();
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  goDashboard(): void {
    this.router.navigate(['/admin'])
  }

  logout(): void {
    // Limpiar datos de inicio de sesión en caché
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.msalService.logout();
  }
}
