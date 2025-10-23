import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';
import { LiquidationSearchRequest } from '../../models/settlement/request/liquidation-search.request';
import { PaginatedResponse } from '../../models/common/response/paginated.response';
import { AllLiquidationResponse } from '../../models/settlement/responses/all-liquidations.response';

@Injectable({
    providedIn: 'root'
})

export class getAllLiquidationsUseCase implements UseCasePromise<LiquidationSearchRequest, PaginatedResponse<AllLiquidationResponse>> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(request: LiquidationSearchRequest): Promise<ResponseData<PaginatedResponse<AllLiquidationResponse>>> {

        return this._liquidationRepository.getAllLiquidation(request)
    }
}