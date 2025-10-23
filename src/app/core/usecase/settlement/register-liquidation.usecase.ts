import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationModel } from '../../models/liquidation.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';

@Injectable({
    providedIn: 'root'
})

export class RegisterLiquidationUsecase implements UseCasePromise<LiquidationModel, LiquidationModel> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(liquidation: LiquidationModel): Promise<ResponseData<LiquidationModel>> {
        return this._liquidationRepository.registerLiquidacion(liquidation)
    }
}
