import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineModel, CreditLineSearch } from 'src/app/core/models/credit-line.model';
import { CREDIT_LINE_URL } from 'src/app/common/helpers/constants/url.constants';
import { CreditLineRepository } from 'src/app/core/repositories/credit-line/credit-line.repository';
import { RegisterCreditLineRequest } from 'src/app/core/models/credit-line/request/register-credit-line.request';
import { GetCreditLineByIdResponse } from 'src/app/core/models/credit-line/response/get-credit-line-by-id.response';
import { GetCreditLineByIdClientResponse } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-cliente.response';
import { DownloadReportExcelRequest } from 'src/app/core/models/credit-line/request/downlodad-report-excel.request';

import { GetCreditLineByIdClientRequest } from 'src/app/core/models/credit-line/request/get-credit-line-by-id-cliente.request';
import { GetCreditLineByIdClientResponses } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-client.response';
import { GetConsumptionByIdClientResponses } from 'src/app/core/models/credit-line/response/get-consumption-by-id-client.response';
import { UpdateCreditLineConsumptionRequest } from 'src/app/core/models/credit-line/request/update-credit-line-consumption.request';
import { DownloadReportConsumoExcelRequest } from 'src/app/core/models/credit-line/request/downlodad-reportconsumo-excel.request';

@Injectable({
    providedIn: 'root'
})

export class  CreditLineWebRepository extends CreditLineRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Line de credito facturacion
    getCreditLineByIdClient(idClient: number): Promise<ResponseData<GetCreditLineByIdClientResponse[]>> {

        const url = `${CREDIT_LINE_URL}/client/${idClient}/creditLine`

        return lastValueFrom(this.http.get<ResponseData<GetCreditLineByIdClientResponse[]>>(url))
    }

    // Listado general de Lineas de credito
    getAllCreditLine(params: CreditLineSearch): Promise<ResponseData<CreditLineModel>> {

        const url = `${CREDIT_LINE_URL}s`

        const filter = {
            PageNumber : params.pageNumber,
            PageSize: params.pageSize,
            Term: params.term,
            Id_Company: params.Id_Company,
            Id_Modality: params.Id_Modality,
            Id_Money: params.Id_Money,
            Id_State: params.Id_State,
            user: params.user
        }

        return lastValueFrom(this.http.get<ResponseData<CreditLineModel>>(url, { params: filter }))
    }

    // Informacion de Linea de Credito por ID
    getCreditLineById(idCreditLine: number): Promise<ResponseData<GetCreditLineByIdResponse>> {

        const url = `${CREDIT_LINE_URL}ById/${idCreditLine}`
        return lastValueFrom(this.http.get<ResponseData<GetCreditLineByIdResponse>>(url))
    }

    // Registro de Linea de Credito
    registerCreditLine(creditLine: RegisterCreditLineRequest): Promise<ResponseData<CreditLineModel>> {

        const url = `${CREDIT_LINE_URL}`
        return lastValueFrom(this.http.post<ResponseData<CreditLineModel>>(url, creditLine))
    }

    // Actualizacion de Linea de credito
    updateCreditLine(idCreditLine: number, creditLine: RegisterCreditLineRequest): Promise<ResponseData<CreditLineModel>> {

        const url = `${CREDIT_LINE_URL}`
        return lastValueFrom(this.http.put<ResponseData<CreditLineModel>>(url, creditLine))
    }

    downloadReportExcel(params: DownloadReportExcelRequest): Promise<{ blob: Blob; fileName: string; }> {

        // const url = `${CREDIT_LINE_URL}/reportExcel/company/${params.id_company}/status/${params.id_status}`
        const url = `${CREDIT_LINE_URL}/reportExcel`
        const filter = {
            id_cliente: params.id_cliente,
            id_Company: params.id_company,
            id_status: params.id_status,
            id_moneda : params.id_moneda,
            id_tipo_reporte : params.id_tipo_reporte
        }

        return lastValueFrom(
          this.http.get(url, {
              params: filter,
              responseType: 'blob',
              observe: 'response'
          }).pipe(
              map(response => {
                  const headers = response.headers;
                  const contentDisposition = headers.get('Content-Disposition');
                  let fileName = 'default.txt';
                  if (contentDisposition) {
                      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                      let matches = fileNameRegex.exec(contentDisposition);
                      if (matches != null && matches[1]) {
                          fileName = matches[1].replace(/['"]/g, '');
                      } else {
                          const fileNameStarRegex = /filename\*[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                          matches = fileNameStarRegex.exec(contentDisposition);
                          if (matches != null && matches[1]) {
                              fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                          }
                      }
                  }
                  return { blob: response.body as Blob, fileName: fileName };
              })
          )
      );

    }

    getCreditLineByIdClientandIdEnterprise(
        params: GetCreditLineByIdClientRequest
      ): Promise<ResponseData<GetCreditLineByIdClientResponses[]>> {
        const url = `${CREDIT_LINE_URL}/client/${params.Id_Client}/company/${params.Id_Company}/creditLine`;
        return lastValueFrom(
          this.http.get<ResponseData<GetCreditLineByIdClientResponses[]>>(url)
        );
      }

      getConsumptionByIdClientandIdEnterprise(
        params: GetCreditLineByIdClientRequest
      ): Promise<ResponseData<GetConsumptionByIdClientResponses[]>> {
        const url = `${CREDIT_LINE_URL}/consumption/client/${params.Id_Client}/company/${params.Id_Company}`;
        return lastValueFrom(
          this.http.get<ResponseData<GetConsumptionByIdClientResponses[]>>(url)
        );
      }

      UpdateCreditLineConsumption(creditLine: UpdateCreditLineConsumptionRequest): Promise<ResponseData<number>> {
        const url = `${CREDIT_LINE_URL}/CreditLineConsumption`
        return lastValueFrom(this.http.put<ResponseData<number>>(url, creditLine))
      }

    downloadReportConsumeExcel(params: DownloadReportConsumoExcelRequest): Promise<{ blob: Blob; fileName: string; }> {

        const url = `${CREDIT_LINE_URL}/reportExcelConsumo`
        const filter = {
            id_cliente: params.id_cliente,
            id_Company: params.id_company,
            id_status: params.id_status,
            id_moneda : params.id_moneda,
            id_CreditLine : params.id_CreditLine
        }

        return lastValueFrom(
          this.http.get(url, {
              params: filter,
              responseType: 'blob',
              observe: 'response'
          }).pipe(
              map(response => {
                  const headers = response.headers;
                  const contentDisposition = headers.get('Content-Disposition');
                  let fileName = 'default.txt';
                  if (contentDisposition) {
                      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                      let matches = fileNameRegex.exec(contentDisposition);
                      if (matches != null && matches[1]) {
                          fileName = matches[1].replace(/['"]/g, '');
                      } else {
                          const fileNameStarRegex = /filename\*[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                          matches = fileNameStarRegex.exec(contentDisposition);
                          if (matches != null && matches[1]) {
                              fileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                          }
                      }
                  }
                  return { blob: response.body as Blob, fileName: fileName };
              })
          )
      );

    }
}
