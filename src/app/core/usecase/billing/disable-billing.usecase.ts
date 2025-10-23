import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { BillingRepository } from '../../repositories/billing/billing.repository';
import { BillingDisableRequest } from '../../models/billing/request/billing-disable-request';

@Injectable({
    providedIn: 'root'
})

export class DisableBillingUsecase implements UseCasePromise<BillingDisableRequest, number> {

    constructor(
        private _billingRepository: BillingRepository
    ) { }

    execute(idBilling: BillingDisableRequest): Promise<ResponseData<number>> {

        return this._billingRepository.disableBilling(idBilling)
    }
}
