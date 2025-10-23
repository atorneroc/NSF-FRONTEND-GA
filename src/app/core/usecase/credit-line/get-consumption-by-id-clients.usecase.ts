import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetCreditLineByIdClientRequest } from 'src/app/core/models/credit-line/request/get-credit-line-by-id-cliente.request';
import { GetConsumptionByIdClientResponses } from 'src/app/core/models/credit-line/response/get-consumption-by-id-client.response';
import { CreditLineRepository } from '../../repositories/credit-line/credit-line.repository';

@Injectable({
    providedIn: 'root'
})
export class GetConsumptionByIdClientUseCase
    implements UseCasePromise<GetCreditLineByIdClientRequest, GetConsumptionByIdClientResponses[]> {
    
    constructor(
        private _creditLineRepository: CreditLineRepository // Verifica que esté inyectado así
    ) {}

    execute(request: GetCreditLineByIdClientRequest): Promise<ResponseData<GetConsumptionByIdClientResponses[]>> {
        return this._creditLineRepository.getConsumptionByIdClientandIdEnterprise(request);
    }
}