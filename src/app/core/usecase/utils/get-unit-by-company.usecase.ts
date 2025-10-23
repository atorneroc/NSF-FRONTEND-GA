import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ParameterModel } from '../../models/parameter.model';
import { GetUnitByCompanyBranchOfficeResponse } from '../../models/utils/responses/get-unit-by-company-branchOffice';
import { GetBusinessUnitByCompanyResponse } from '../../models/utils/responses/get-business-unit-by-company.model';

@Injectable({
    providedIn: 'root'
})

export class GetUnitByCompanyUseCase implements UseCasePromise<number, GetBusinessUnitByCompanyResponse[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(idCompany: number): Promise<ResponseData<GetBusinessUnitByCompanyResponse[]>> {

        return this._utilsRepository.GetUnitByCompany(idCompany);
    }
}
