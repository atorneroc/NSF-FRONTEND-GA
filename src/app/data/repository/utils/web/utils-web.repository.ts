import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ClientModel } from 'src/app/core/models/client.model';

import { ResponseData } from 'src/app/core/models/response.model';
import { UtilsRepository } from 'src/app/core/repositories/utils/utils.repository';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ExchangeRateModel } from 'src/app/core/models/exchange-rate.model';
import { UTILS_URL } from 'src/app/common/helpers/constants/url.constants';
import { environment } from 'src/environments/environment';
import { countriesModel } from 'src/app/core/models/countries.model';
import { ubigeoModel } from 'src/app/core/models/ubigeo.model';
import { GetBusinessUnitByCompanyResponse } from 'src/app/core/models/utils/responses/get-business-unit-by-company.model';
import { GetProductByCompanyBusinessUnitRequest } from 'src/app/core/models/utils/request/get-business-unit-by-company.request';
import { GetProductByCompanyBusinessUnitResponse } from 'src/app/core/models/utils/responses/get-product-by-company-business-unit.response';
import { CollectionManagerResponse } from 'src/app/core/models/utils/responses/collection-manager.response';

@Injectable({
    providedIn: 'root'
})

export class UtilsWebRepository extends UtilsRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Verificar identificacion por numero de documento
    verifyIdentity(numberDocumentIdentity: string): Promise<ResponseData<ClientModel>> {

        const url = `${UTILS_URL}/${numberDocumentIdentity}`

        return lastValueFrom(this.http.get<ResponseData<ClientModel>>(url))
    }

    // Crear cliente en SAP
    registerClientSAP(client: ClientModel): Promise<ResponseData<ClientModel>> {

        const url = `${UTILS_URL}/createSAP`
        return lastValueFrom(this.http.post<ResponseData<ClientModel>>(url, client))
    }

    // Cambio de moneda por fecha
    getExchangeRateByDate(dateExchangeRate: string): Promise<ResponseData<ExchangeRateModel>> {

        const url = `${UTILS_URL}/exchangeRate/byDate/${dateExchangeRate}`

        return lastValueFrom(this.http.get<ResponseData<ExchangeRateModel>>(url))
    }

    // Listado de parametros por id
    getParameterById(groupId: string): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/parameter/${groupId}`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getAllCompanies(): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/enterprises`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getBranchOfficeById(enterpriseId: number): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/enterprise/${enterpriseId}/branchOffices`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getUnitById(enterpriseId: number, branchOfficeId: number): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/enterprise/${enterpriseId}/branchOffice/${branchOfficeId}/businessUnits`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getStoreById(enterpriseId: number, branchOfficeId: number, businessUnitId: number): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/enterprise/${enterpriseId}/branchOffice/${branchOfficeId}/businessUnit/${businessUnitId}/stores`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getStoreByBranchOfficeId(branchOfficeId: number): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/enterprise/businessUnit/branchOffice/${branchOfficeId}/stores`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    getBranchOfficeByUnitId(businessUnitId: number): Promise<ResponseData<ParameterModel[]>> {

        const url = `${UTILS_URL}/businessUnit/${businessUnitId}/branchoffice`

        return lastValueFrom(this.http.get<ResponseData<ParameterModel[]>>(url))
    }

    downloadFile(filename: string): Promise<Blob> {

        const url = `${environment.API_URL_UTILS}BlobStorage/${filename}`

        return lastValueFrom(this.http.get<Blob>(url, { responseType: 'blob' as 'json' }))
    }

    getAllCountries(term: string ): Promise<ResponseData<countriesModel[]>> {

        const url = `${UTILS_URL}/countries`

        const params = new HttpParams().set('Term', term || '');
        return lastValueFrom(this.http.get<ResponseData<countriesModel[]>>(url, { params }));
    }

    getAllCountrieById(id: number ): Promise<ResponseData<countriesModel[]>> {

        const url = `${UTILS_URL}/countries/${id}`

        return lastValueFrom(this.http.get<ResponseData<countriesModel[]>>(url));
    }

    getAllLocationsByUbigeoId(ubigeoId: string): Promise<ResponseData<ubigeoModel[]>> {

        const url = `${UTILS_URL}/ubigeo/${ubigeoId}`

        return lastValueFrom(this.http.get<ResponseData<ubigeoModel[]>>(url))
    }

    GetUnitByCompany(idCompany: number): Promise<ResponseData<GetBusinessUnitByCompanyResponse[]>> {

        const url = `${UTILS_URL}/enterprise/${idCompany}/businessUnit`

        return lastValueFrom(this.http.get<ResponseData<GetBusinessUnitByCompanyResponse[]>>(url))
    }

    GetProductByCompanyBusinessUnit(request: GetProductByCompanyBusinessUnitRequest): Promise<ResponseData<GetProductByCompanyBusinessUnitResponse[]>> {

        const url = `${UTILS_URL}/enterprise/${request.Id_Company}/businessUnit/${request.Id_Business_Unit}/product`

        return lastValueFrom(this.http.get<ResponseData<GetProductByCompanyBusinessUnitResponse[]>>(url))
    }

    // Listado de parametros por id
    getAllCollectionManager(profileId: string): Promise<ResponseData<CollectionManagerResponse[]>> {

        const url = `${UTILS_URL}/user/GetUserByProfile/${profileId}`

        return lastValueFrom(this.http.get<ResponseData<CollectionManagerResponse[]>>(url))
    }
}
