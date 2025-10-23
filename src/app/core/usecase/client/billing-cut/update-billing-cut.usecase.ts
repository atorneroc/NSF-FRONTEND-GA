import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { RegisterBillingCut } from 'src/app/core/models/billing-cut.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { BillingCutRepository } from 'src/app/core/repositories/client/billing-cut.repository';

@Injectable({
    providedIn: 'root'
})

export class UpdateBillingCutsUsecase implements UseCasePromise<RegisterBillingCut, number> {

    constructor(
        private _billingCutRepository: BillingCutRepository
    ) { }

    execute(billingCuts: RegisterBillingCut): Promise<ResponseData<number>> {

        return this._billingCutRepository.updateBillingCuts(billingCuts)
    }
}