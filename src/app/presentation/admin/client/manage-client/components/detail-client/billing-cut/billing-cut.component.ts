import { Component, OnInit } from '@angular/core';
import { UpdateContactComponent } from '../contacts-client/components/update-contact/update-contact.component';
import { ContactModel } from 'src/app/core/models/contact.model';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeleteContactByIdUsecase } from 'src/app/core/usecase/client/contact/delete-contact-by-id.usecase';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { RegisterBillingCutComponent } from './components/register-billing-cut/register-billing-cut.component';
import { GetBillingCutsByIdClientUsecase } from 'src/app/core/usecase/client/billing-cut/get-billing-cuts-by-id-client';
import { BillingCutModel } from 'src/app/core/models/billing-cut.model';
import { UpdateBillingCutComponent } from './components/update-billing-cut/update-billing-cut.component';
import { internals } from '@azure/msal-browser';
import { CutsClientEstadoRequest } from 'src/app/core/models/client/request/couts-client-status.request';
import { AutomaticResponse } from 'src/app/core/models/client/responses/automatic.response';
import { UpdateCutsClientsEstadoUsecase } from 'src/app/core/usecase/client/billing-cut/update-cuts-clients-estado.usecase';
import { AlertService } from 'src/app/common/shared/services/alert.service';

@Component({
  selector: 'app-billing-cut',
  templateUrl: './billing-cut.component.html',
  styleUrls: ['./billing-cut.component.scss']
})
export class BillingCutComponent implements OnInit {

    lBillingCuts: BillingCutModel[] = []
    idClient: number
    client: ClientModel

    constructor(
        public dialogService: DialogService,
        private _route: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _getBillingCutsByIdClient: GetBillingCutsByIdClientUsecase,
        private _deleteContactById: DeleteContactByIdUsecase,
        private _getClientById: GetClientByIdUsecase,
        private _updateCutsClientsEstado:UpdateCutsClientsEstadoUsecase,
        private _alertService: AlertService,
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.idClient = params['id']
            this.getBillingCutsByIdClient(this.idClient)
            this.getClientById(this.idClient)
        })
    }

    async getClientById(idClient: number) {
        try {
            let data: ResponseData<ClientModel> = await this._getClientById.execute(idClient)
            this.client = data.data
        }
        catch (error) {
            console.log(error)
        }
    }

    async getBillingCutsByIdClient(idClient: number) {
        try {
            const response: ResponseData<BillingCutModel[]> = await this._getBillingCutsByIdClient.execute(idClient)
            if (response && response.data) {
                this.lBillingCuts = response.data;
            } else {
                this.lBillingCuts = [];
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    showModalBillingCut(type: boolean, idEmpresa: number) {

        const idClient = this.idClient
        const lastIdContact =  1
        const data = { idClient, lastIdContact, type , idEmpresa}
        const headers = type ? "Actualizar" : "Agregar";

        const ref = this.dialogService.open(RegisterBillingCutComponent, {
            header: `${headers} corte de facturacion`,
            data: { ...data, contactList: this.lBillingCuts },
            width: '65rem'
        })

        ref.onClose.subscribe(() => { setTimeout(() => {
            this.getBillingCutsByIdClient(this.idClient)
        }, 300); })
    }

    async cancelProfile(idEmpresa?: number) {

        const idClient = this.idClient
        this._confirmationService.confirm({
            header: `Anular`,
            acceptLabel : "Si",
            rejectLabel : "No",
            message: `¿Seguro que deseas anular todo registro de corte de facturación?`,
            defaultFocus: "accept",
        reject: () => {
                this._messageService.add({
                severity: 'warn',
                summary: `Anular`,
                detail: 'Se canceló la operación',
                });
            },
        accept: async () => {
                const request: CutsClientEstadoRequest = {
                    id_cliente: idClient,
                    id_empresa: idEmpresa,
                    usuario_creacion: localStorage.getItem('username')
                }
                let data: ResponseData<AutomaticResponse>;
                data = await this._updateCutsClientsEstado.execute(request);
                    setTimeout(() => {
                        this.getBillingCutsByIdClient(this.idClient);
                    }, 300);
                    this._alertService.success(data.message); 
                }    
            });

    }
}
