import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineModel } from '../../models/credit-line.model';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';
import { RegisterCreditLineRequest } from '../../models/credit-line/request/register-credit-line.request';
@Injectable({
    providedIn: 'root'
})

export class RegisterCreditLineUsecase implements UseCasePromise<null, CreditLineModel> {

    constructor(
        private _creditLineRepository: CreditLineRepository
    ) { }

    execute(creditLine: RegisterCreditLineRequest): Promise<ResponseData<CreditLineModel>> {
        return this._creditLineRepository.registerCreditLine(creditLine)
    }
}
