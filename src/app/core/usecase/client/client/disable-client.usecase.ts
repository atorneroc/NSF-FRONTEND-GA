import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { disableClientRequest } from 'src/app/core/models/client/request/disable-client-request';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';

@Injectable({
    providedIn: 'root'
})

export class DisableClientUsecase implements UseCasePromise<disableClientRequest, number> {

    constructor(
        private _clientRepository: ClientRepository
    ) { }

    execute(idClient: disableClientRequest): Promise<ResponseData<number>> {

        return this._clientRepository.disableClient(idClient)
    }
}
