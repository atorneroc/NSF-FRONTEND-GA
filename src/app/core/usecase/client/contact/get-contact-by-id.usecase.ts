import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ContactModel } from 'src/app/core/models/contact.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';

@Injectable({
    providedIn: 'root'
})

export class GetContactByIdUsecase implements UseCasePromise<number, ContactModel> {

    constructor(
        private _contactRepository: ContactRepository
    ) { }

    execute(idContact: number): Promise<ResponseData<ContactModel>> {

        return this._contactRepository.getContactById(idContact)
    }
}