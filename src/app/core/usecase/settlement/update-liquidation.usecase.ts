import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { liquidationDetail, SettlementDetail } from '../../models/liquidation.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class UpdateLiquidationUsecase implements UseCasePromise<liquidationDetail, SettlementDetail> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(detailLiquidation: liquidationDetail): Promise<ResponseData<SettlementDetail>> {
        return this._liquidationRepository.updateLiquidation(detailLiquidation)
    }
}
