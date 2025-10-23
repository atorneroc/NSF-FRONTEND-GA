import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';
import { CreditLineModel } from '../../models/credit-line.model';
import { GetCreditLineByIdResponse } from '../../models/credit-line/response/get-credit-line-by-id.response';

@Injectable({
    providedIn: 'root'
})

export class GetCreditLineByIdUsecase implements UseCasePromise<number, GetCreditLineByIdResponse> {

    constructor(
        private _creditLineRepository: CreditLineRepository
    ) { }

    execute(idCreditLine: number): Promise<ResponseData<GetCreditLineByIdResponse>> {

        return this._creditLineRepository.getCreditLineById(idCreditLine)
    }
}
