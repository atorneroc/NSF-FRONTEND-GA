import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ResponseData } from 'src/app/core/models/response.model';
import { AllServiceResponse } from '../../models/settlement/responses/all-service.response';
import { ServiceRepository } from '../../repositories/service/service.repository';
import { RateServiceSearch } from '../../models/liquidation.model';

@Injectable({
    providedIn: 'root'
})

export class GetAllServicesUseCase implements UseCasePromise<null, AllServiceResponse[]> {

    constructor(
        private _serviceRepository: ServiceRepository
    ) { }

    execute(filter: RateServiceSearch): Promise<ResponseData<AllServiceResponse[]>> {

        return this._serviceRepository.getAllServices(filter)
    }
}
