import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationModel, RateRangeSearch } from '../../models/liquidation.model';
import { RateModel, ServiceRateRangeModel } from '../../models/rate.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class GetRatesRangeUseCase implements UseCasePromise<null, ServiceRateRangeModel> {

    constructor(
        private _ratesRepository: LiquidationRepository
    ) { }

    execute(params: RateRangeSearch): Promise<ResponseData<ServiceRateRangeModel>> {
        return this._ratesRepository.getRatesByRange(params)
    }
}
