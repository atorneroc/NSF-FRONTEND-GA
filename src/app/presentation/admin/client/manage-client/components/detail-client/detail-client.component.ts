import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { StatusSap } from 'src/app/common/helpers/constants/status-sap.constants';
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { SharedDataUrlService } from 'src/app/common/shared/services/shared-data-url.service';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';

@Component({
    selector: 'app-detail-client',
    templateUrl: './detail-client.component.html',
    styleUrls: ['./detail-client.component.scss'],
})

export class DetailClientComponent implements OnInit {
    breadcrumbItems: any[] = [
      { label: 'Búsqueda Cliente', url: '' },
      { label: 'Información Cliente', url: '' }
    ];
    client: ClientModel
    StatusSap = StatusSap

    constructor(
        public loaderService: LoaderService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _getClientById: GetClientByIdUsecase,
        private _messageService: MessageService,
        private _sharedDataService: SharedDataUrlService
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.getClientById(params['id'])
        })
        this.actualizarBreadcrumbItems()
    }
    actualizarBreadcrumbItems() {
      const newItems: MenuItem[] = [
        { label: 'Inicio' },
        { label: 'Clientes', routerLink :'client/' },
        { label: 'Detalle Cliente' },
      ];
      this._sharedDataService.setBreadcrumbItems(newItems);
    }
    async getClientById(idClient: number) {
        try {
            const data: ResponseData<ClientModel> = await this._getClientById.execute(idClient)
            this.client = data.data
        }
        catch (error) {
            console.log(error)
        }
    }

    manageClient() {
        this._router.navigate(['/admin/client'])
    }
}
