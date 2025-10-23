import { ClientModel } from '../../models/client.model';
import { countriesModel } from '../../models/countries.model';
import { ExchangeRateModel } from '../../models/exchange-rate.model';
import { ParameterModel } from '../../models/parameter.model';
import { ResponseData } from '../../models/response.model';
import { ubigeoModel } from '../../models/ubigeo.model';
import { GetProductByCompanyBusinessUnitRequest } from '../../models/utils/request/get-business-unit-by-company.request';
import { CollectionManagerResponse } from '../../models/utils/responses/collection-manager.response';
import { GetBusinessUnitByCompanyResponse } from '../../models/utils/responses/get-business-unit-by-company.model';
import { GetProductByCompanyBusinessUnitResponse } from '../../models/utils/responses/get-product-by-company-business-unit.response';

export abstract class UtilsRepository {

    abstract verifyIdentity(numberDocumentIdentity: string): Promise<ResponseData<ClientModel>>

    abstract registerClientSAP(client: ClientModel): Promise<ResponseData<ClientModel>>

    abstract getExchangeRateByDate(formattedDate: string): Promise<ResponseData<ExchangeRateModel>>

    abstract getParameterById(idParameter: string): Promise<ResponseData<ParameterModel[]>>

    abstract getAllCompanies(): Promise<ResponseData<ParameterModel[]>>

    abstract getUnitById(idCompany: number, idBranchOffice: number): Promise<ResponseData<ParameterModel[]>>

    abstract getStoreById(idCompany: number, idBranchOffice: number, idBusinessUnit: number): Promise<ResponseData<ParameterModel[]>>

    abstract getBranchOfficeById(id: number): Promise<ResponseData<ParameterModel[]>>

    abstract getStoreByBranchOfficeId(branchOfficeId: number): Promise<ResponseData<ParameterModel[]>>

    abstract getBranchOfficeByUnitId(unitId: number): Promise<ResponseData<ParameterModel[]>>

    abstract downloadFile(fileName: string): Promise<Blob>

    abstract getAllCountries(term : string): Promise<ResponseData<countriesModel[]>>

    abstract getAllCountrieById(id : number): Promise<ResponseData<countriesModel[]>>

    abstract getAllLocationsByUbigeoId(ubigeoId: string): Promise<ResponseData<ubigeoModel[]>>

    abstract GetUnitByCompany(idCompany: number): Promise<ResponseData<GetBusinessUnitByCompanyResponse[]>>
    abstract GetProductByCompanyBusinessUnit (request: GetProductByCompanyBusinessUnitRequest): Promise<ResponseData<GetProductByCompanyBusinessUnitResponse[]>>

    abstract getAllCollectionManager(profileId: string): Promise <ResponseData<CollectionManagerResponse[]>>

}
