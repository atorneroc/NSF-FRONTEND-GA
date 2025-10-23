import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CLIENT_URL } from 'src/app/common/helpers/constants/url.constants';
import { ResponseData } from 'src/app/core/models/response.model';
import { AddressModel } from 'src/app/core/models/address.model';
import { AddressRepository } from 'src/app/core/repositories/client/address.repository';
import { AddressByIdDisableRequest } from 'src/app/core/models/client/request/address-by-id-disable-request';


@Injectable({
    providedIn: 'root'
})

export class AddressWebRepository extends AddressRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado general de direcciones por Cliente
    getAllAddressesByClientId(clientId: number): Promise<ResponseData<AddressModel[]>> {

        const url = `${CLIENT_URL}/${clientId}/adresses`
        return lastValueFrom(this.http.get<ResponseData<AddressModel[]>>(url))
    }

    // Listado de direccion por su id
    getAddressById(addressId: number): Promise<ResponseData<AddressModel>> {

        const url = `${CLIENT_URL}/address/${addressId}`
        return lastValueFrom(this.http.get<ResponseData<AddressModel>>(url))
    }

    // Registrar direccion por cliente
    registerAddressByClientId(address: AddressModel): Promise<ResponseData<AddressModel>> {

        const url = `${CLIENT_URL}/address`
        return lastValueFrom(this.http.post<ResponseData<AddressModel>>(url, address))
    }

    // Actualizar direccion por cliente
    updateAddressById(addressId: number, address: AddressModel): Promise<ResponseData<AddressModel>> {

        const url = `${CLIENT_URL}/address/${addressId}`
        return lastValueFrom(this.http.put<ResponseData<AddressModel>>(url, address))
    }

    // Eliminar direccion por cliente
    deleteAddressById(addressId: AddressByIdDisableRequest): Promise<ResponseData<number>> {

        const url = `${CLIENT_URL}/address/${addressId.id}/disable?user=${addressId.user}`
        return lastValueFrom(this.http.put<ResponseData<number>>(url,null))
    }
}
