import { Injectable } from '@angular/core';
import { ResponseData } from 'src/app/core/models/response.model';
import { LiquidationRepository } from '../../repositories/settlement/liquidation.repository';
import { UseCaseBlob } from '../../base/use-case-blob';

@Injectable({
    providedIn: 'root'
})

export class GetReportExcelLiquidationByIdUseCase implements UseCaseBlob<number, Blob> {

    constructor(
        private _liquidationRepository: LiquidationRepository
    ) { }

    execute(idLiquidation: number): Promise<Blob> {

        return this._liquidationRepository.getReportExcelLiquidationById(idLiquidation)
    }
}
