import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationModel, RateSearch } from '../../models/liquidation.model';
import { RateModel, ServiceRateModel } from '../../models/rate.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class GetRatesUseCase implements UseCasePromise<null, ServiceRateModel[]> {

    constructor(
        private _ratesRepository: LiquidationRepository
    ) { }

    execute(params: RateSearch): Promise<ResponseData<ServiceRateModel[]>> {
        return this._ratesRepository.getRates(params)
    }
}