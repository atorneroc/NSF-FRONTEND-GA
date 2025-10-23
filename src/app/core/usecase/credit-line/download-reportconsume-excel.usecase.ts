import { Injectable } from "@angular/core";
import { UseCaseBlob } from "../../base/use-case-blob";
import { CreditLineRepository } from "../../repositories/credit-line/credit-line.repository";
import { DownloadReportConsumoExcelRequest } from "../../models/credit-line/request/downlodad-reportconsumo-excel.request";
@Injectable({
  providedIn: 'root'
})

export class DownloadReportConsumeExcelUseCase implements UseCaseBlob<DownloadReportConsumoExcelRequest, {blob: Blob, fileName: string}>
{
  constructor(
    private _creditLineRepository: CreditLineRepository
  ) { }

  execute(request: DownloadReportConsumoExcelRequest): Promise<{ blob: Blob; fileName: string; }> {
    return this._creditLineRepository.downloadReportConsumeExcel(request)
  }



}
