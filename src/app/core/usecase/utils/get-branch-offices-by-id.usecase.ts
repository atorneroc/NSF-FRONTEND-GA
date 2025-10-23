import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ParameterModel } from '../../models/parameter.model';

@Injectable({
    providedIn: 'root'
})

export class GetBranchOfficeById implements UseCasePromise<number, ParameterModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(id: number): Promise<ResponseData<ParameterModel[]>> {

        return this._utilsRepository.getBranchOfficeById(id);
    }
}
