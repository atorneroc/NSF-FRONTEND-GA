import { Injectable } from '@angular/core';
import { ParameterModel } from '../../models/parameter.model';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';

@Injectable({
    providedIn: 'root'
})

export class GetParameterByIdUseCase implements UseCasePromise<string, ParameterModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(idParameter: string): Promise<ResponseData<ParameterModel[]>> {

        return this._utilsRepository.getParameterById(idParameter);
    }
}
