import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { enableClientRequest } from 'src/app/core/models/client/request/enable-client-request';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';

@Injectable({
    providedIn: 'root'
})

export class EnableClientUsecase implements UseCasePromise<enableClientRequest, number> {

    constructor(
        private _clientRepository: ClientRepository
    ) { }

    execute(idClient: enableClientRequest): Promise<ResponseData<number>> {

        return this._clientRepository.enableClient(idClient)
    }
}
