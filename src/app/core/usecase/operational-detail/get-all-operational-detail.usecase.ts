import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { AllOperationalDetailResponse } from '../../models/settlement/responses/all-operational-detail.response';
import { OperationalDetailRepository } from '../../repositories/operational-detail/operational-detail.repository';
import { RateDetailSearch } from 'src/app/core/models/liquidation.model';
@Injectable({
    providedIn: 'root'
})

export class GetAllOperationalDetailUseCase implements UseCasePromise<null, AllOperationalDetailResponse[]> {

    constructor(
        private _operationalDetailRepository: OperationalDetailRepository
    ) { }

    execute(params:RateDetailSearch): Promise<ResponseData<AllOperationalDetailResponse[]>> {

        return this._operationalDetailRepository.getAllOperationalDetails(params)
    }
}
