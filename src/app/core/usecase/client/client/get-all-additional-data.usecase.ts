import { UseCasePromise } from "src/app/core/base/use-case-promise";
import { ResponseData } from "src/app/core/models/response.model";
import { ClientRepository } from "src/app/core/repositories/client/client.repository";
import { Injectable } from '@angular/core';
import { AdditionalData } from '../../../models/client.model';


@Injectable({
    providedIn: 'root'
})
export class GetAdditionalDataUsecase implements UseCasePromise<null, AdditionalData> {

    constructor(
        private _clientRepository: ClientRepository
    ){}
    
    execute(idClient: number): Promise<ResponseData<AdditionalData>> {
        return this._clientRepository.getAdditionalDataClient(idClient)
    }
}