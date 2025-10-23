import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ContactModel, RegisterContact } from 'src/app/core/models/contact.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';

@Injectable({
    providedIn: 'root'
})

export class RegisterContactByClientIdUsecase implements UseCasePromise<RegisterContact, ContactModel> {

    constructor(
        private _contactRepository: ContactRepository
    ) { }

    execute(contact: RegisterContact): Promise<ResponseData<ContactModel>> {

        return this._contactRepository.registerContactByClientId(contact)
    }
}