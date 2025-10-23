import { CreditLineModel, CreditLineSearch } from "../../models/credit-line.model";
import { DownloadReportExcelRequest } from "../../models/credit-line/request/downlodad-report-excel.request";
import { RegisterCreditLineRequest } from "../../models/credit-line/request/register-credit-line.request";
import { GetCreditLineByIdClientResponse } from "../../models/credit-line/response/get-credit-line-by-id-cliente.response";
import { GetCreditLineByIdResponse } from "../../models/credit-line/response/get-credit-line-by-id.response";
import { GetCreditLineByIdClientRequest } from 'src/app/core/models/credit-line/request/get-credit-line-by-id-cliente.request';
import { GetCreditLineByIdClientResponses } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-client.response';
import { GetConsumptionByIdClientResponses } from 'src/app/core/models/credit-line/response/get-consumption-by-id-client.response';
import { ResponseData } from "../../models/response.model";
import { UpdateCreditLineConsumptionRequest } from "../../models/credit-line/request/update-credit-line-consumption.request";
import { DownloadReportConsumoExcelRequest } from "../../models/credit-line/request/downlodad-reportconsumo-excel.request";

export abstract class CreditLineRepository {

    abstract getCreditLineByIdClient(idClient: number): Promise<ResponseData<GetCreditLineByIdClientResponse[]>>

    abstract getAllCreditLine(params: CreditLineSearch): Promise<ResponseData<CreditLineModel>>

    abstract getCreditLineById(idCreditLine: number): Promise<ResponseData<GetCreditLineByIdResponse>>

    abstract registerCreditLine(creditLine: RegisterCreditLineRequest): Promise<ResponseData<CreditLineModel>>

    abstract updateCreditLine(idCreditLine: number, creditLine: RegisterCreditLineRequest): Promise<ResponseData<CreditLineModel>>

    abstract downloadReportExcel(params: DownloadReportExcelRequest): Promise<{blob: Blob, fileName: string}>

    abstract getCreditLineByIdClientandIdEnterprise(request: GetCreditLineByIdClientRequest): Promise<ResponseData<GetCreditLineByIdClientResponses[]>>

    abstract getConsumptionByIdClientandIdEnterprise(request: GetCreditLineByIdClientRequest): Promise<ResponseData<GetConsumptionByIdClientResponses[]>>

    abstract UpdateCreditLineConsumption(creditLine: UpdateCreditLineConsumptionRequest): Promise<ResponseData<number>>

    abstract downloadReportConsumeExcel(params: DownloadReportConsumoExcelRequest): Promise<{blob: Blob, fileName: string}>

}
