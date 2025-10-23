import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ParameterModel } from '../../models/parameter.model';
import { GetStoreByCompanyBranchOfficeUnitResponse } from '../../models/utils/responses/get-store-by-company-branchOffice-businessUnit';

@Injectable({
    providedIn: 'root'
})

export class GetStoreById implements UseCasePromise<null, ParameterModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(params: GetStoreByCompanyBranchOfficeUnitResponse): Promise<ResponseData<ParameterModel[]>> {

        return this._utilsRepository.getStoreById(params.idCompany, params.idBranchOffice, params.idBusinessUnit);
    }
}
