import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ClientSapModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';

@Injectable({
    providedIn: 'root'
})

export class RegisterClientSapUsecase implements UseCasePromise<ClientSapModel, ClientSapModel> {

    constructor(
        private _clientRepository: ClientRepository
    ) { }

    execute(client: ClientSapModel): Promise<ResponseData<ClientSapModel>> {

        return this._clientRepository.registerClientSap(client)
    }
}
