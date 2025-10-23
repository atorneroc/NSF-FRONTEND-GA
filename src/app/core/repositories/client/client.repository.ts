import { ClientModel, ClientSearch, AdditionalData,ClientSapModel } from '../../models/client.model';
import { ResponseData } from '../../models/response.model';
import { ParameterModel } from '../../models/parameter.model';
import { disableClientRequest } from '../../models/client/request/disable-client-request';
import { enableClientRequest } from '../../models/client/request/enable-client-request';
import { ClientSunatRequest } from '../../models/client/request/client-sunat-request';
import { ClientSunatResponse } from '../../models/client/responses/client-sunat-response';

export abstract class ClientRepository {

    abstract getAllClients(params: ClientSearch): Promise<ResponseData<ClientModel>>

    abstract getClientById(idClient: number): Promise<ResponseData<ClientModel>>

    abstract registerClient(client: ClientModel): Promise<ResponseData<ClientModel>>

    abstract registerClientSap(client: ClientSapModel): Promise<ResponseData<ClientSapModel>>

    abstract updateClient(idClient: number, client: ClientModel): Promise<ResponseData<ClientModel>>

    abstract disableClient(idClient: disableClientRequest): Promise<ResponseData<number>>

    abstract enableClient(idClient: enableClientRequest): Promise<ResponseData<number>>

    abstract validateClient(client: ClientModel): Promise<ResponseData<ClientModel>>

    abstract getClientByName(name: string): Promise<ResponseData<ClientModel>>

    abstract getClientWithRucByName(name: string): Promise<ResponseData<ClientModel>>

    abstract getAdditionalDataClient(idClient: number): Promise<ResponseData<AdditionalData>>

    abstract saveAdditionalData(body: AdditionalData): Promise<ResponseData<AdditionalData>>

    abstract updateAdditionalData(body: AdditionalData): Promise<ResponseData<AdditionalData>>

    abstract getDataClientSunat(params: ClientSunatRequest): Promise<ResponseData<ClientSunatResponse>>
    
    abstract getClient(request: any): Promise<ResponseData<any>>;
    
    abstract getCreditLineClients(request: any): Promise<ResponseData<any>>;
}
