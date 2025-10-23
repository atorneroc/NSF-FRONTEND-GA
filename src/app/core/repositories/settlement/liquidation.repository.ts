import { liquidationDetail, LiquidationModel, SettlementDetail, RateSearch, RateRangeSearch } from '../../models/liquidation.model';
import { ResponseData } from "../../models/response.model";
import { ServiceRateModel, ServiceRateRangeModel } from '../../models/rate.model';
import { LiquidationSearchRequest } from '../../models/settlement/request/liquidation-search.request';
import { PaginatedResponse } from '../../models/common/response/paginated.response';
import { AllLiquidationResponse } from '../../models/settlement/responses/all-liquidations.response';
import { LiquidationDisableRequest } from '../../models/settlement/request/liquidation-disable-request';

export abstract class LiquidationRepository {

    abstract getAllLiquidation(request: LiquidationSearchRequest): Promise<ResponseData<PaginatedResponse<AllLiquidationResponse>>>

    abstract disableLiquidation(idliquidation: LiquidationDisableRequest): Promise<ResponseData<number>>

    abstract getReportPdfLiquidationById(idliquidation: number): Promise<ResponseData<Blob>>

    abstract getReportExcelLiquidationById(idliquidation: number): Promise<Blob>

    abstract registerLiquidacion(liquidation: LiquidationModel): Promise<ResponseData<LiquidationModel>>

    abstract updateLiquidation(settlement: liquidationDetail): Promise<ResponseData<SettlementDetail>>

    abstract getLiquidationById(id: number): Promise<ResponseData<SettlementDetail>>

    abstract getRates(params: RateSearch): Promise<ResponseData<ServiceRateModel[]>>

    abstract getRatesByRange(params: RateRangeSearch): Promise<ResponseData<ServiceRateRangeModel>>
}



