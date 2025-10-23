import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { CreditLineModel } from 'src/app/core/models/credit-line.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';
import { GetCreditLineByIdClientResponse } from '../../models/credit-line/response/get-credit-line-by-id-cliente.response';


@Injectable({
    providedIn: 'root'
})

export class GetCreditLineByIdClientUseCase implements UseCasePromise<number, GetCreditLineByIdClientResponse[]> {

    constructor(
        private _creditLineRepository: CreditLineRepository
    ) { }

    execute(idClient: number): Promise<ResponseData<GetCreditLineByIdClientResponse[]>> {
        return this._creditLineRepository.getCreditLineByIdClient(idClient)
    }
}
