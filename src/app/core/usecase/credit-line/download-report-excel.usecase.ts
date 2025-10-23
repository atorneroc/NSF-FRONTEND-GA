import { Injectable } from "@angular/core";
import { UseCaseBlob } from "../../base/use-case-blob";
import { DownloadReportExcelRequest } from "../../models/credit-line/request/downlodad-report-excel.request";
import { CreditLineRepository } from "../../repositories/credit-line/credit-line.repository";
@Injectable({
  providedIn: 'root'
})

export class DownloadReportExcelUseCase implements UseCaseBlob<DownloadReportExcelRequest, {blob: Blob, fileName: string}>
{
  constructor(
    private _creditLineRepository: CreditLineRepository
  ) { }

  execute(request: DownloadReportExcelRequest): Promise<{ blob: Blob; fileName: string; }> {
    return this._creditLineRepository.downloadReportExcel(request)
  }



}
