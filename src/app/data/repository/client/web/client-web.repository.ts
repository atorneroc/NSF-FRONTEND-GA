import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AdditionalData, ClientModel,ClientSapModel } from 'src/app/core/models/client.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';
import { CHARLIE_URL, CLIENT_SAP_URL, CLIENT_URL } from 'src/app/common/helpers/constants/url.constants';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientSearch } from '../../../../core/models/client.model';
import { disableClientRequest } from 'src/app/core/models/client/request/disable-client-request';
import { enableClientRequest } from 'src/app/core/models/client/request/enable-client-request';
import { ClientSunatRequest } from 'src/app/core/models/client/request/client-sunat-request';
import { ClientSunatResponse } from 'src/app/core/models/client/responses/client-sunat-response';
import { ParameterResponse } from 'src/app/core/models/utils/parameter.response';

@Injectable({
    providedIn: 'root'
})

export class ClientWebRepository extends ClientRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado general de Clientes
    getAllClients(params: ClientSearch): Promise<ResponseData<ClientModel>> {

        const url = `${CLIENT_URL}s`

        const filter = {
            Page_Number: params.pageNumber,
            Page_Size: params.pageSize,
            Term: params.term,
            Id_Company: params.idCompany,
            Id_Type_Client: params.idTypeClient,
            Id_Status_Credit_Line: params.idStatusCreditLine,
            Id_Status_Sap: params.idStatusSap,
            User: params.user
        }

        return lastValueFrom(this.http.get<ResponseData<ClientModel>>(url, { params: filter }))
    }

    // Informacion de Cliente por ID
    getClientById(clientId: number): Promise<ResponseData<ClientModel>> {

        const url = `${CLIENT_URL}/${clientId}`
        return lastValueFrom(this.http.get<ResponseData<ClientModel>>(url))
    }

    // Registro de Cliente
    registerClient(client: ClientModel): Promise<ResponseData<ClientModel>> {

        const url = `${CLIENT_URL}`
        return lastValueFrom(this.http.post<ResponseData<ClientModel>>(url, client))
    }

    // Actualizacion de Cliente
    updateClient(clientId: number, client: ClientModel): Promise<ResponseData<ClientModel>> {

        const url = `${CLIENT_URL}/${clientId}`
        return lastValueFrom(this.http.put<ResponseData<ClientModel>>(url, client))
    }

    // Inhabilitar Cliente
    disableClient(clientId: disableClientRequest): Promise<ResponseData<number>> {

        //304/disable?user=userstefanini%40holascharff.com
        const url = `${CLIENT_URL}/${clientId.id}/disable?user=${clientId.user}`
        return lastValueFrom(this.http.put<ResponseData<number>>(url, null))
    }

    // Habilitar Cliente
    enableClient(clientId: enableClientRequest): Promise<ResponseData<number>> {

        const url = `${CLIENT_URL}/${clientId.id}/enable?user=${clientId.user}`
        return lastValueFrom(this.http.put<ResponseData<number>>(url, null))
    }

    // Validar Cliente
    validateClient(client: ClientModel): Promise<ResponseData<ClientModel>> {

        const url = `${CLIENT_URL}/validate`
        return lastValueFrom(this.http.post<ResponseData<ClientModel>>(url, client))
    }

    // Obtener Cliente por Nombre
    getClientByName(name: string): Promise<ResponseData<ClientModel>> {
        
        const encodedName = encodeURIComponent(name);
        const url = `${CLIENT_URL}s/filter?term=${encodedName}`
        return lastValueFrom(this.http.get<ResponseData<ClientModel>>(url))
    }

    // Obtener Cliente por Nombre
    getClientWithRucByName(name: string): Promise<ResponseData<ClientModel>> {

        const encodedName = encodeURIComponent(name);
        const url = `${CLIENT_URL}s/ruc/filter?term=${encodedName}`;
        return lastValueFrom(this.http.get<ResponseData<ClientModel>>(url));
    }

    // Obtener datos adicionales de cliente
    getAdditionalDataClient(clientId: number): Promise<ResponseData<AdditionalData>> {

        const url = `${CLIENT_URL}/${clientId}/categories`

        return lastValueFrom(this.http.get<ResponseData<AdditionalData>>(url))
    }

    // Guardar datos adicionales de cliente
    saveAdditionalData(body: AdditionalData): Promise<ResponseData<AdditionalData>> {

        const url = `${CLIENT_URL}/categories`
        return lastValueFrom(this.http.post<ResponseData<ClientModel>>(url, body))
    }

    // Actualizar datos adicionales de cliente
    updateAdditionalData(body: AdditionalData): Promise<ResponseData<AdditionalData>> {

        const url = `${CLIENT_URL}/${body.id_Client}/categories`
        return lastValueFrom(this.http.put<ResponseData<ClientModel>>(url, body))
    }

    // Registro de Cliente Sap
    registerClientSap(client: ClientSapModel): Promise<ResponseData<ClientSapModel>> {

      const url = `${CLIENT_SAP_URL}/AddClientSAP`
      return lastValueFrom(this.http.post<ResponseData<ClientSapModel>>(url, client))
  }

    //Obtener informacion cliente Sunat
    getDataClientSunat(params: ClientSunatRequest): Promise<ResponseData<ClientSunatResponse>> {
        const url = `${CHARLIE_URL}/getInformationClientSunat`
        const filter = {
            Doc_number: params.docNumber,
            Type_document_sunat: params.typeDocumentSunat
        }
        return lastValueFrom(this.http.get<ResponseData<ClientSunatResponse>>(url, { params: filter }))
    }

    override getClient(request: any): Promise<ResponseData<any>> {
        const params = new HttpParams()
          .set('keys', request.keys)
          .set('value', request.value);
        const url = `${CLIENT_URL}s/search`
        return lastValueFrom(this.http.get<ResponseData<ParameterResponse[]>>(url, { params }));
      }

    getCreditLineClients(request: any): Promise<ResponseData<any>> {
        const params = new HttpParams()
            .set('keys', request.keys)
            .set('value', request.value)
            .set('typeClient', request.typeClient);
        const url = `${CLIENT_URL}s/searchClientsByParameterType`
        return lastValueFrom(this.http.get<ResponseData<ParameterResponse[]>>(url, { params }));
    }
}
