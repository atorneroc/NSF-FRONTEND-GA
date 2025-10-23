import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ConfirmationService, MenuItem} from 'primeng/api';
import { filter, map, Subscription } from 'rxjs';
import { AD_URL_BILLING } from 'src/app/common/helpers/constants/url.constants';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { SharedDataUrlService } from 'src/app/common/shared/services/shared-data-url.service';
import { MenuRequest } from 'src/app/core/models/Layout/request/menu.request';
import { MenuResponse } from 'src/app/core/models/Layout/response/menu.response';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetMenuByEmailUseCase } from 'src/app/core/usecase/layout/get_menu_by_email.usecase';

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss'],
})

export class LayoutComponent implements OnInit {

    display: boolean
    items: MenuItem[] = []
    activeItem: MenuItem

    breadcrumbItems: MenuItem[] = []
    titleSubscription: Subscription

    constructor(
        private _router: Router,
        private _sharedDataService: SharedDataUrlService,
        private msalService: MsalService,
        private _confirmationService: ConfirmationService,
        private _getMenuByEmail: GetMenuByEmailUseCase,
        private _alertService: AlertService,
    ) {
        // this.titleSubscription = this.getArgumentosRuta().subscribe(({ title }) => {
        //     this.setBreadCrumb(title)
        // })
    }

    ngOnInit() {
        this.setItemsMenu()
        this.activeItem = this.items[0];
        this._sharedDataService
        .getBreadcrumbItems()
        .subscribe((items) => (this.breadcrumbItems = items));
    }

    async setItemsMenu() {
      const param: MenuRequest ={
        user_email:localStorage.getItem('username')
      }
      const response: ResponseData<MenuResponse[]> = await this._getMenuByEmail.execute(param);
      localStorage.setItem('access',response.data[0].privilege.toString())
      this.items = response.data[0].lstMenu
      // .filter(element => element.system_Description === 'Sistema de Liquidación')
      .map(element => ({

        label: element.menu_Description,
        icon: element.icon,
        command: () => {
          let route = '';
          if (element.system_Description=== 'Sistema de Liquidación') {
            route = 'admin/' + element.route;
          } else {
            route = AD_URL_BILLING + 'admin/' + element.route;
            window.location.href = route; // Redirección a otro dominio
            return;
          }
            this._router.navigate([route])
        }
        //command: () => this._router.navigate(['admin/' + element.route])
      }));

      if (this.items.length==0) {
        this._alertService.error(`Disculpe, usted no tiene permiso para acceder a esta página.`)
      }

    }

    getName(): string {
      return localStorage.getItem('name')
    }

    logout(): void {
      this._confirmationService.confirm({
          message:  `¿Desea cerrar la sesión? `,
          accept: async () => {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            this.msalService.logout();
          },
      })
    }


    getArgumentosRuta() {
      return this._router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
    }
}
