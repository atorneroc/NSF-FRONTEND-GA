import { Injectable } from '@angular/core';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';
import { UseCaseBlob } from '../../base/use-case-blob';

@Injectable({
    providedIn: 'root'
})

export class GetReportPdfLiquidationByIdUseCase implements UseCaseBlob<number, ResponseData<Blob>> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(idLiquidation: number): Promise<ResponseData<Blob>> {

        return this._liquidationRepository.getReportPdfLiquidationById(idLiquidation)
    }
}
