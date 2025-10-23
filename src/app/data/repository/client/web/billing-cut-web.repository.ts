import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { CLIENT_URL } from 'src/app/common/helpers/constants/url.constants';
import { BillingCutRepository } from 'src/app/core/repositories/client/billing-cut.repository';
import { BillingCutModel, RegisterBillingCut } from 'src/app/core/models/billing-cut.model';
import { CutsClientEstadoRequest } from 'src/app/core/models/client/request/couts-client-status.request';
import { AutomaticResponse } from 'src/app/core/models/client/responses/automatic.response';

@Injectable({
    providedIn: 'root'
})

export class BillingCutWebRepository extends BillingCutRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado general de cortes de facturacion
    getBillingCutsByIdClient(clientId: number): Promise<ResponseData<BillingCutModel[]>> {

        const url = `${CLIENT_URL}/${clientId}/billing-cuts`
        return lastValueFrom(this.http.get<ResponseData<BillingCutModel[]>>(url))
    }

    // // Listado de contacto por su id
    // getContactById(contactId: number): Promise<ResponseData<ContactModel>> {

    //     const url = `${CLIENT_URL}/contact/${contactId}`
    //     return lastValueFrom(this.http.get<ResponseData<ContactModel>>(url))
    // }

    // Registrar de cortes de facturacion
    registerBillingCuts (contact: RegisterBillingCut): Promise<ResponseData<number>>{

        const url = `${CLIENT_URL}/billing-cuts`
        return lastValueFrom(this.http.post<ResponseData<number>>(url, contact))
    }

    updateBillingCuts (contact: RegisterBillingCut): Promise<ResponseData<number>>{

        const url = `${CLIENT_URL}/billing-cuts-update`
        return lastValueFrom(this.http.put<ResponseData<number>>(url, contact))
    }

    updateCutClientsEstado(request: CutsClientEstadoRequest): Promise<ResponseData<AutomaticResponse>> {
      const url = `${CLIENT_URL}/billing-cuts-update-estado`;
      return lastValueFrom(this.http.put<ResponseData<AutomaticResponse>>(url, request))
    }
    // // Actualizar contacto por cliente
    // updateContactById(contactId: number, contact: UpdateContact): Promise<ResponseData<number>> {

    //     const url = `${CLIENT_URL}/contact/${contactId}`
    //     return lastValueFrom(this.http.put<ResponseData<number>>(url, contact))
    // }

    // // Eliminar contacto por cliente
    // deleteContactById(contactId: ContactByIdDisableRequest): Promise<ResponseData<number>> {

    //     const url = `${CLIENT_URL}/contact/${contactId.id}/disable?user=${contactId.user}`
    //     return lastValueFrom(this.http.put<ResponseData<number>>(url,null))
    // }
}
