import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { AddressModel } from 'src/app/core/models/address.model';
import { AddressByIdDisableRequest } from 'src/app/core/models/client/request/address-by-id-disable-request';
import { ResponseData } from 'src/app/core/models/response.model';
import { AddressRepository } from 'src/app/core/repositories/client/address.repository';

@Injectable({
    providedIn: 'root'
})

export class DeleteAddressByIdUsecase implements UseCasePromise<AddressByIdDisableRequest, number> {

    constructor(
        private _addressRepository: AddressRepository
    ) { }

    execute(idAddress: AddressByIdDisableRequest): Promise<ResponseData<number>> {

        return this._addressRepository.deleteAddressById(idAddress)
    }
}
