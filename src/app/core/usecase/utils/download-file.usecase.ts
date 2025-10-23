import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { UseCaseBlob } from '../../base/use-case-blob';

@Injectable({
    providedIn: 'root'
})

export class DownloadFileUseCase implements UseCaseBlob<string, Blob> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(fileName: string): Promise<Blob> {

        return this._utilsRepository.downloadFile(fileName);
    }
}
