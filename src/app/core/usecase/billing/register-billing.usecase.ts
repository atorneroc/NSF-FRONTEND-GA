import { Injectable } from '@angular/core';
import { UseCasePromise } from '../../base/use-case-promise'
import { BillingModel } from '../../models/billing.model';
import { ResponseData } from '../../models/response.model';
import { BillingRepository } from '../../repositories/billing/billing.repository';

@Injectable({
    providedIn: 'root'
})

export class RegisterBillingUsecase implements UseCasePromise<BillingModel, BillingModel> {

    constructor(
        private _billingRepository: BillingRepository
    ) { }

    execute(billing: BillingModel): Promise<ResponseData<BillingModel>> {

        return this._billingRepository.registerBilling(billing)
    }
}
