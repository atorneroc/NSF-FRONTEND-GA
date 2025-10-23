import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientModel } from 'src/app/core/models/client.model';
import { ContactModel } from 'src/app/core/models/contact.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { DeleteContactByIdUsecase } from 'src/app/core/usecase/client/contact/delete-contact-by-id.usecase';
import { GetAllContactsByClientIdUsecase } from 'src/app/core/usecase/client/contact/get-all-contacts-by-client-id.usecase';
import { RegisterContactComponent } from './components/register-contact/register-contact.component';
import { UpdateContactComponent } from './components/update-contact/update-contact.component';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactByIdDisableRequest } from 'src/app/core/models/client/request/contact-by-id-disable-request';

@Component({
    selector: 'app-contacts-client',
    templateUrl: './contacts-client.component.html',
})

export class ContactsClientComponent implements OnInit {

    lContacts: ContactModel[] = []
    idClient: number
    client: ClientModel

    constructor(
        public dialogService: DialogService,
        private _route: ActivatedRoute,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService,
        private _getAllContactsByIdClient: GetAllContactsByClientIdUsecase,
        private _deleteContactById: DeleteContactByIdUsecase,
        private _getClientById: GetClientByIdUsecase,
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.idClient = params['id']
            this.getAllContactsByIdClient(this.idClient)
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

    async getAllContactsByIdClient(idClient: number) {
        try {
            const response: ResponseData<ContactModel[]> = await this._getAllContactsByIdClient.execute(idClient)
            this.lContacts = response.data
        }
        catch (error) {
            console.log(error)
        }
    }

    async deleteContactById(idClient: number, id: number){
        try {
            this._confirmationService.confirm({
                message: `¿Desea dar de baja al contacto N°: ${id}?`,
                accept: async () => {
                    const request : ContactByIdDisableRequest={
                        id : idClient,
                        user : localStorage.getItem('username')
                    }
                    const response = await this._deleteContactById.execute(request)
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se dió de baja a este contacto' || response.message,
                    });

                    this.getAllContactsByIdClient(this.idClient)
                },
                reject: () => {
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'Alerta',
                        detail: 'Se cancelo la operación',
                    });
                }
            })
        }

        catch (error) {
            console.log(error)
        }
    }

    showModalRegisterContact() {

        const idClient = this.idClient
        const lastIdContact = this.lContacts == undefined ? this.lContacts.slice(-1)[0].id : 0
        const data = { idClient, lastIdContact }

        const ref = this.dialogService.open(RegisterContactComponent, {
            header: 'Crear Contacto',
            data: { ...data, contactList: this.lContacts },
            width: '65rem'
        })

        ref.onClose.subscribe(() => { setTimeout(() => {
            this.getAllContactsByIdClient(this.idClient)
        }, 300); })
    }

    showModalUpdateContact(contact: ContactModel) {
        const id_Client = contact.id_Client
        const idContact = contact.id

        const ref = this.dialogService.open(UpdateContactComponent, {
            header: 'Actualizar Contacto',
            data: { id_Client, idContact,  contactList: this.lContacts },
            width: '75rem'
        })
        ref.onClose.subscribe(() => { this.getAllContactsByIdClient(this.idClient) })
    }

}
