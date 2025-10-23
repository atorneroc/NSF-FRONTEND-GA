import { Injectable } from '@angular/core';
import { UseCasePromise } from '../../base/use-case-promise'
import { BillingModel, BillingSearch } from '../../models/billing.model';
import { ResponseData } from '../../models/response.model';
import { BillingRepository } from '../../repositories/billing/billing.repository';

@Injectable({
    providedIn: 'root'
})

export class GetAllBillingsUsecase implements UseCasePromise<BillingSearch, BillingModel[]> {

    constructor(
        private _billingRepository: BillingRepository
    ) { }

    execute(params: BillingSearch): Promise<ResponseData<BillingModel[]>> {

        return this._billingRepository.getAllBillings(params)
    }
}
