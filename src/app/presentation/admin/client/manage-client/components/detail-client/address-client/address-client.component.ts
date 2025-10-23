import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { GetAllAddressByClientIdUsecase } from 'src/app/core/usecase/client/address/get-all-address-by-client-id.usecase';
import { ActivatedRoute } from '@angular/router';
import { AddressModel } from 'src/app/core/models/address.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { DeleteAddressByIdUsecase } from 'src/app/core/usecase/client/address/delete-address-by-id.usecase';
import { RegisterAddressComponent } from './components/register-address/register-address.component';
import { UpdateAddressComponent } from './components/update-address/update-address.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { ClientModel } from 'src/app/core/models/client.model';
import { AddressType } from 'src/app/common/helpers/constants/address_type.constants';
import { AddressByIdDisableRequest } from 'src/app/core/models/client/request/address-by-id-disable-request';


@Component({
    selector: 'app-address-client',
    templateUrl: 'address-client.component.html',
    styleUrls: ['./address-client.component.scss']
})

export class AddressClientComponent implements OnInit {

    idClient: number
    lAddress: AddressModel[] = []

    client: ClientModel

    existFiscalAddress: boolean = false;

    FISCAL_ADDRESS = AddressType.FISCAL;
    OPERATIONAL_ADDRESS = AddressType.OPERATIONAL;


    constructor(
        private _route: ActivatedRoute,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
        public dialogService: DialogService,
        private _getAllAddresses: GetAllAddressByClientIdUsecase,
        private _deleteAddressById: DeleteAddressByIdUsecase,
        private _getClientById: GetClientByIdUsecase,
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.idClient = params['id']
            this.getAllAddresses(this.idClient)
            this.getClientById(this.idClient)
            this.getTypeAddress()
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

    async getAllAddresses(idClient: number) {
        try {
            let data: ResponseData<AddressModel[]> = await this._getAllAddresses.execute(idClient)
            this.lAddress = data.data
            this.existFiscalAddress = this.validateExistenceAddress(data.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    validateExistenceAddress(lAddress: any[]){
        return lAddress.some( address => address.detail_Code == AddressType.FISCAL && address.status_Description === 'Activo')
    }

    async deleteAddressById(idAddress: number, address_Type_Description: string) {
        try {
            this._confirmationService.confirm({
                message: `¿Desea dar de baja a esta ${address_Type_Description}?`,
                accept: async () => {

                    const request : AddressByIdDisableRequest={
                        id : idAddress,
                        user : localStorage.getItem('username')
                    }

                    const response: ResponseData<number> = await this._deleteAddressById.execute(request)
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Se dió de baja a la dirección' || response.message,
                    });

                    this.getAllAddresses(this.idClient)
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

    showModalRegisterDirection() {

        const data = this.idClient
        const ref = this.dialogService.open(RegisterAddressComponent, {
            header: 'Crear Dirección',
            data: { data, existFiscalAddress: this.existFiscalAddress},
            width: '60rem',
        })

        ref.onClose.subscribe(() => {
            this.getAllAddresses(this.idClient)
        })
    }

    showModalUpdateDirection(addressId: number) {
        const data = addressId;
        const ref = this.dialogService.open(UpdateAddressComponent, {
            header: 'Actualizar Dirección',
            data: { 
                data: data,  
                idClient : this.idClient,
                existFiscalAddress: this.existFiscalAddress
            },
            width: '60rem',
        });

        ref.onClose.subscribe(() => {
            this.getAllAddresses(this.idClient)
        })
    }

    getTypeAddress() {

    }

}
