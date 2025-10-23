import { ContactByIdDisableRequest } from '../../models/client/request/contact-by-id-disable-request';
import { ContactModel, RegisterContact, UpdateContact } from '../../models/contact.model';
import { ResponseData } from '../../models/response.model';

export abstract class ContactRepository {

    abstract getAllContactsByClientId(idClient: number): Promise<ResponseData<ContactModel[]>>

    abstract getContactById(idContact: number): Promise<ResponseData<ContactModel>>

    abstract registerContactByClientId(contact: RegisterContact): Promise<ResponseData<ContactModel>>

    abstract updateContactById(idContact: number, contact: UpdateContact): Promise<ResponseData<number>>

    abstract deleteContactById(idContact: ContactByIdDisableRequest): Promise<ResponseData<number>>

}