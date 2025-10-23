import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineModel, CreditLineSearch } from '../../models/credit-line.model';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';

@Injectable({
    providedIn: 'root'
})

export class GetAllCreditLineUseCase implements UseCasePromise<null, CreditLineModel> {

    constructor(
        private _creditLineRepository: CreditLineRepository
    ) { }

    execute(params: CreditLineSearch): Promise<ResponseData<CreditLineModel>> {
        return this._creditLineRepository.getAllCreditLine(params)
    }
}