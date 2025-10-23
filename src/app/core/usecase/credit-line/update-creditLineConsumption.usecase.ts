import { Injectable } from "@angular/core";
import { UseCasePromise } from "../../base/use-case-promise";
import { UpdateCreditLineConsumptionRequest } from "../../models/credit-line/request/update-credit-line-consumption.request";
import { ResponseData } from "../../models/response.model";
import { CreditLineRepository } from "../../repositories/credit-line/credit-line.repository";

@Injectable({
    providedIn: 'root'
})

export class UpdateCreditLineConsumptionUseCase implements UseCasePromise<UpdateCreditLineConsumptionRequest, number> {

    constructor(
        private _creditLineRepository: CreditLineRepository
    ) { }

    execute(creditLine: UpdateCreditLineConsumptionRequest): Promise<ResponseData<number>> {

        return this._creditLineRepository.UpdateCreditLineConsumption(creditLine)
    }
}
