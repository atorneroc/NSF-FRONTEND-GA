import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { ContactModel, RegisterContact, UpdateContact } from 'src/app/core/models/contact.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';
import { CLIENT_URL } from 'src/app/common/helpers/constants/url.constants';
import { ContactByIdDisableRequest } from 'src/app/core/models/client/request/contact-by-id-disable-request';


@Injectable({
    providedIn: 'root'
})

export class ContactWebRepository extends ContactRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    // Listado general de contactos por Cliente
    getAllContactsByClientId(clientId: number): Promise<ResponseData<ContactModel[]>> {

        const url = `${CLIENT_URL}/${clientId}/contacts`
        return lastValueFrom(this.http.get<ResponseData<ContactModel[]>>(url))
    }

    // Listado de contacto por su id
    getContactById(contactId: number): Promise<ResponseData<ContactModel>> {

        const url = `${CLIENT_URL}/contact/${contactId}`
        return lastValueFrom(this.http.get<ResponseData<ContactModel>>(url))
    }

    // Registrar contacto por cliente
    registerContactByClientId(contact: RegisterContact): Promise<ResponseData<ContactModel>> {

        const url = `${CLIENT_URL}/contact`
        return lastValueFrom(this.http.post<ResponseData<ContactModel>>(url, contact))
    }

    // Actualizar contacto por cliente
    updateContactById(contactId: number, contact: UpdateContact): Promise<ResponseData<number>> {

        const url = `${CLIENT_URL}/contact/${contactId}`
        return lastValueFrom(this.http.put<ResponseData<number>>(url, contact))
    }

    // Eliminar contacto por cliente
    deleteContactById(contactId: ContactByIdDisableRequest): Promise<ResponseData<number>> {

        const url = `${CLIENT_URL}/contact/${contactId.id}/disable?user=${contactId.user}`
        return lastValueFrom(this.http.put<ResponseData<number>>(url,null))
    }
}
