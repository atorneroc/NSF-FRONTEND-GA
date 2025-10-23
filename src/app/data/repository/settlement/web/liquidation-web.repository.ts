import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationRepository } from '../../../../core/repositories/settlement/liquidation.repository';
import { liquidationDetail, LiquidationModel, SettlementDetail, RateSearch, RateRangeSearch } from '../../../../core/models/liquidation.model';
import { LIQUIDATION_URL, RATE_URL } from '../../../../common/helpers/constants/url.constants';
import { ServiceRateModel, ServiceRateRangeModel } from 'src/app/core/models/rate.model';
import { LiquidationSearchRequest } from 'src/app/core/models/settlement/request/liquidation-search.request';
import { PaginatedResponse } from 'src/app/core/models/common/response/paginated.response';
import { AllLiquidationResponse } from 'src/app/core/models/settlement/responses/all-liquidations.response';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { LiquidationDisableRequest } from 'src/app/core/models/settlement/request/liquidation-disable-request';

@Injectable({
    providedIn: 'root'
})

export class LiquidationWebRepository extends LiquidationRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado de liquidaciones
    getAllLiquidation(request: LiquidationSearchRequest): Promise<ResponseData<PaginatedResponse<AllLiquidationResponse>>> {

        const url = `${LIQUIDATION_URL}s`

        const filter = {
            page_number: request.page_number,
            page_size: request.page_size,
            term: request.term,
            id_company: request.id_company,
            id_business_unit: request.id_business_unit,
            id_branch_office: request.id_branch_office,
            id_store: request.id_store,
            id_status: request.id_status,
            type_currency: request.type_currency,
            user: request.user
        }

        return lastValueFrom(this.http.get<ResponseData<PaginatedResponse<AllLiquidationResponse>>>(url, { params: filter }))
    }

    // Inhabilitar liquidacion
    disableLiquidation(idliquidation: LiquidationDisableRequest): Promise<ResponseData<number>> {

        //liquidation/643/disable?user=test'
        const url = `${LIQUIDATION_URL}/${idliquidation.id}/disable?user=${idliquidation.user}`

        return lastValueFrom(this.http.put<ResponseData<number>>(url, null))
    }

    getReportPdfLiquidationById(idLiquidation: number): Promise<ResponseData<Blob>> {

        const url = `${LIQUIDATION_URL}/${idLiquidation}/reportpdf`

        return lastValueFrom(this.http.get<ResponseData<Blob>>(url, { responseType: 'blob' as 'json' }))
    }

    getReportExcelLiquidationById(idLiquidation: number): Promise<Blob> {

        const url = `${LIQUIDATION_URL}/${idLiquidation}/reportexcel`

        return lastValueFrom(this.http.get<Blob>(url, { responseType: 'blob' as 'json' }))
    }

    // Registro de Liquidacion
    registerLiquidacion(liquidation: LiquidationModel): Promise<ResponseData<LiquidationModel>> {

        const url = `${LIQUIDATION_URL}`

        return lastValueFrom(this.http.post<ResponseData<LiquidationModel>>(url, liquidation))
    }

    // Actualizar Liquidacion
    updateLiquidation(settlement: liquidationDetail): Promise<ResponseData<SettlementDetail>> {

        const url = `${LIQUIDATION_URL}/${settlement.id_Liquidation}`

        return lastValueFrom(this.http.put<ResponseData<SettlementDetail>>(url, settlement))
    }

    // Obtener liquidacion por su id
    getLiquidationById(liquidationId: number): Promise<ResponseData<SettlementDetail>> {

        const url = `${LIQUIDATION_URL}/${liquidationId}`

        return lastValueFrom(this.http.get<ResponseData<SettlementDetail>>(url))
    }

    // listado de Tarifas
    getRates(params: RateSearch): Promise<ResponseData<ServiceRateModel[]>> {

        const url = `${RATE_URL}`

        const filter = {
            IdCompany: params.company_id,
            IdBusinessUnit: params.business_unit_id,
            IdBranchOffice: params.branch_office_id,
            IdStore: params.idStore,
            IdClient: params.idclient,
            IdTypeCurrency: params.idtypecurrency
        }

        return lastValueFrom(this.http.get<ResponseData<ServiceRateModel[]>>(url, { params: filter }))
    }

    // Tarifa por rango
    getRatesByRange(params: RateRangeSearch): Promise<ResponseData<ServiceRateRangeModel>> {

        const url = `${RATE_URL}/rateRange`

        const filter = {
            rateId: params.rateId,
            quantity: params.quantity
        }

        return lastValueFrom(this.http.get<ResponseData<ServiceRateRangeModel>>(url, { params: filter }))
    }

}
