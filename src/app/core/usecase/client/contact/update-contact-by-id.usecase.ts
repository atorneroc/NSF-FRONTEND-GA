import { Injectable } from '@angular/core';
import { UseCasePromise } from 'src/app/core/base/use-case-promise';
import { ContactModel, RegisterContact, UpdateContact } from 'src/app/core/models/contact.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';

@Injectable({
    providedIn: 'root'
})

export class UpdateContactByIdUsecase implements UseCasePromise<UpdateContact, number> {

    constructor(
        private _contactRepository: ContactRepository
    ) { }

    execute(contact: UpdateContact): Promise<ResponseData<number>> {

        return this._contactRepository.updateContactById(contact.id, contact)
    }
}