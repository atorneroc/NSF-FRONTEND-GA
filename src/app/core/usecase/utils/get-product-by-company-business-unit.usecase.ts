import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ParameterModel } from '../../models/parameter.model';
import { GetUnitByCompanyBranchOfficeResponse } from '../../models/utils/responses/get-unit-by-company-branchOffice';
import { GetBusinessUnitByCompanyResponse } from '../../models/utils/responses/get-business-unit-by-company.model';
import { GetProductByCompanyBusinessUnitRequest } from '../../models/utils/request/get-business-unit-by-company.request';
import { GetProductByCompanyBusinessUnitResponse } from '../../models/utils/responses/get-product-by-company-business-unit.response';

@Injectable({
    providedIn: 'root'
})

export class GetProductByCompanyBusinessUnitUseCase implements UseCasePromise<null, GetProductByCompanyBusinessUnitResponse[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(request: GetProductByCompanyBusinessUnitRequest): Promise<ResponseData<GetProductByCompanyBusinessUnitResponse[]>> {

        return this._utilsRepository.GetProductByCompanyBusinessUnit(request);
    }
}
