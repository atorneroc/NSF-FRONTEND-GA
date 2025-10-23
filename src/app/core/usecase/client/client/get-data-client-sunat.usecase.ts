import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { disableClientRequest } from 'src/app/core/models/client/request/disable-client-request';
import { ClientSunatRequest } from 'src/app/core/models/client/request/client-sunat-request';
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';
import { ClientSunatResponse } from 'src/app/core/models/client/responses/client-sunat-response';

@Injectable({
    providedIn: 'root'
})

export class GetDataClientSunatUseCase implements UseCasePromise<ClientSunatRequest, ClientSunatResponse> {

    constructor(
        private _clientRepository: ClientRepository
    ) { }

    execute(params: ClientSunatRequest): Promise<ResponseData<ClientSunatResponse>> {

        return this._clientRepository.getDataClientSunat(params)
    }
}
