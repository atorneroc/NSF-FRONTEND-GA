import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ExchangeRateModel } from 'src/app/core/models/exchange-rate.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { UtilsRepository } from '../../repositories/utils/utils.repository';

@Injectable({
    providedIn: 'root'
})

export class GetExchangeRateUseCase implements UseCasePromise<string, ExchangeRateModel> {

    constructor(
        private _exchangeRateRepository: UtilsRepository
    ) { }

    execute(formattedDate: string): Promise<ResponseData<ExchangeRateModel>> {
        
        return this._exchangeRateRepository.getExchangeRateByDate(formattedDate)
    }

}