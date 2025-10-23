import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ParameterModel } from '../../models/parameter.model';
import { GetUnitByCompanyBranchOfficeResponse } from '../../models/utils/responses/get-unit-by-company-branchOffice';

@Injectable({
    providedIn: 'root'
})

export class GetUnitByIdUseCase implements UseCasePromise<null, ParameterModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(params: GetUnitByCompanyBranchOfficeResponse): Promise<ResponseData<ParameterModel[]>> {

        return this._utilsRepository.getUnitById(params.idCompany, params.idBranchOffice);
    }
}
