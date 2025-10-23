import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetCreditLineByIdClientRequest } from 'src/app/core/models/credit-line/request/get-credit-line-by-id-cliente.request';
import { GetCreditLineByIdClientResponses } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-client.response';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';

@Injectable({
    providedIn: 'root'
})
export class GetCreditLineByIdClientUseCase
    implements UseCasePromise<GetCreditLineByIdClientRequest, GetCreditLineByIdClientResponses[]> {
    
    constructor(
        private _creditLineRepository: CreditLineRepository // Verifica que esté inyectado así
    ) {}

    execute(request: GetCreditLineByIdClientRequest): Promise<ResponseData<GetCreditLineByIdClientResponses[]>> {
        return this._creditLineRepository.getCreditLineByIdClientandIdEnterprise(request);
    }
}