import { BillingCutModel, RegisterBillingCut } from '../../models/billing-cut.model';
import { CutsClientEstadoRequest } from '../../models/client/request/couts-client-status.request';
import { AutomaticResponse } from '../../models/client/responses/automatic.response';
import { ResponseData } from '../../models/response.model';

export abstract class BillingCutRepository {

    abstract getBillingCutsByIdClient (idClient: number): Promise<ResponseData<BillingCutModel[]>>

    // abstract getContactById(idContact: number): Promise<ResponseData<ContactModel>>

    abstract registerBillingCuts (contact: RegisterBillingCut): Promise<ResponseData<number>>
    
    abstract updateBillingCuts (contact: RegisterBillingCut): Promise<ResponseData<number>>

    abstract updateCutClientsEstado(request: CutsClientEstadoRequest): Promise<ResponseData<AutomaticResponse>>

}