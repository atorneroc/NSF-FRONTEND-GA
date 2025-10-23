import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';
import { ClientSearch } from '../../../models/client.model';

@Injectable({
    providedIn: 'root'
})

export class GetAllClientsUsecase implements UseCasePromise<null, ClientModel> {

    constructor(
        private _clientRepository: ClientRepository
    ) { }

    execute(params: ClientSearch): Promise<ResponseData<ClientModel>> {
        return this._clientRepository.getAllClients(params)
    }
}
