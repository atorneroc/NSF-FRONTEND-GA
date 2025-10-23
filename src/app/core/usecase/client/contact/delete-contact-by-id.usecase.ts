import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ContactByIdDisableRequest } from 'src/app/core/models/client/request/contact-by-id-disable-request';
import { ContactModel } from 'src/app/core/models/contact.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';

@Injectable({
    providedIn: 'root'
})

export class DeleteContactByIdUsecase implements UseCasePromise<ContactByIdDisableRequest, number> {

    constructor(
        private _contactRepository: ContactRepository
    ) { }

    execute(idClient: ContactByIdDisableRequest): Promise<ResponseData<number>> {

        return this._contactRepository.deleteContactById(idClient)
    }
}
