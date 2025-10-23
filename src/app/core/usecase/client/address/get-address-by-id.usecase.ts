import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { AddressModel } from 'src/app/core/models/address.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { AddressRepository } from 'src/app/core/repositories/client/address.repository';

@Injectable({
    providedIn: 'root'
})

export class GetAddressByIdUsecase implements UseCasePromise<number, AddressModel> {

    constructor(
        private _addressRepository: AddressRepository
    ) { }

    execute(idAddress: number): Promise<ResponseData<AddressModel>> {

        return this._addressRepository.getAddressById(idAddress)
    }
}
