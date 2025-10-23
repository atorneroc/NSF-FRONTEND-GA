import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BILLING_URL } from 'src/app/common/helpers/constants/url.constants';
import { ResponseData } from 'src/app/core/models/response.model';
import { BillingRepository } from 'src/app/core/repositories/billing/billing.repository';
import { BillingModel, BillingSearch } from 'src/app/core/models/billing.model';
import { BillingDisableRequest } from 'src/app/core/models/billing/request/billing-disable-request';


@Injectable({
    providedIn: 'root'
})

export class BillingWebRepository extends BillingRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado general de Facturas
    getAllBillings(params: BillingSearch): Promise<ResponseData<BillingModel[]>> {

        const url = `${BILLING_URL}s`

        const filter = {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            idCompany: params.company_id,
            idBranchOffice: params.pageNumber,
            idBusinessunit: params.business_unit_id
        }

        return lastValueFrom(this.http.get<ResponseData<BillingModel[]>>(url, { params: filter }))
    }

    // Registro de Factura
    registerBilling(billing: BillingModel): Promise<ResponseData<BillingModel>> {

        const url = `${BILLING_URL}`
        
        return lastValueFrom(this.http.post<ResponseData<BillingModel>>(url, billing))
    }

    // Inhabilitar Billing
    disableBilling(billingId: BillingDisableRequest): Promise<ResponseData<number>> {

        const url = `${BILLING_URL}/${billingId}/disable?user=${billingId.user}`

        return lastValueFrom(this.http.put<ResponseData<number>>(url, null))
    }

}
