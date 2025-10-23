import { LiquidationDisableRequest } from 'src/app/core/models/settlement/request/liquidation-disable-request';
import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class DisableLiquidationUsecase implements UseCasePromise<LiquidationDisableRequest, number> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(idliquidation: LiquidationDisableRequest): Promise<ResponseData<number>> {

        return this._liquidationRepository.disableLiquidation(idliquidation)
    }
}
