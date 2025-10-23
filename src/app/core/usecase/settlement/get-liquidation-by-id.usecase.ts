import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { SettlementDetail } from '../../models/liquidation.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class GetLiquidationByIdUsecase implements UseCasePromise< number, SettlementDetail> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(id: number): Promise<ResponseData<SettlementDetail>> {
        return this._liquidationRepository.getLiquidationById(id)
    }
}
