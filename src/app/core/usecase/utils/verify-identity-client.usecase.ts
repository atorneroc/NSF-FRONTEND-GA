import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { UtilsRepository } from '../../repositories/utils/utils.repository';

@Injectable({
    providedIn: 'root'
})

export class VerifyIdentityClientUsecase implements UseCasePromise<string, ClientModel> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(numberDocumentIdentity: string): Promise<ResponseData<ClientModel>> {

        return this._utilsRepository.verifyIdentity(numberDocumentIdentity)
    }
}
