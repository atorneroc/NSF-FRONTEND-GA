import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { BillingCutModel } from 'src/app/core/models/billing-cut.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { BillingCutRepository } from 'src/app/core/repositories/client/billing-cut.repository';

@Injectable({
    providedIn: 'root'
})

export class GetBillingCutsByIdClientUsecase implements UseCasePromise<number, BillingCutModel[]> {

    constructor(
        private _billingCutRepository: BillingCutRepository
    ) { }

    execute(idClient: number): Promise<ResponseData<BillingCutModel[]>> {

        return this._billingCutRepository.getBillingCutsByIdClient(idClient)
    }
}
