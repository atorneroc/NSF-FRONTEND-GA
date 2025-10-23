import { BillingModel, BillingSearch } from '../../models/billing.model';
import { BillingDisableRequest } from '../../models/billing/request/billing-disable-request';
import { ResponseData } from '../../models/response.model';

export abstract class BillingRepository {

    abstract getAllBillings(params: BillingSearch): Promise<ResponseData<BillingModel[]>>

    abstract registerBilling(billing: BillingModel): Promise<ResponseData<BillingModel>>

    abstract disableBilling(idBilling: BillingDisableRequest): Promise<ResponseData<number>>

}
