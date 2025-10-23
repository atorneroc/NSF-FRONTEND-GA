import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ContactModel } from 'src/app/core/models/contact.model';
import { ContactRepository } from 'src/app/core/repositories/client/contact.repository';


@Injectable({
  providedIn: 'root',
})
export class ContactMockRepository extends ContactRepository {
  constructor() {
    super();
  }

  contacts = [
    {
      id: 1,
      name: 'Josué CB',
      contactArea: 'Area test',
      contactType: 'Contacto Interno',
      status: 'Activo',
      phone: '987609879',
      email: 'jcaycho@sapia.com.pe',
      comments: 'Contacto de confianza',
    },
    {
      id: 2,
      name: 'Manuel Moyano',
      contactArea: 'Area Ventas',
      contactType: 'Contacto Externo',
      status: 'Activo',
      phone: '987609811',
      email: 'mmoyano@test.com.pe',
      comments: 'Contacto del área de ventas',
    }
  ];

  registerContact(body: ContactModel): any {
    console.log('RESPONSEEEE XD', body);
    return from([{}]);
  }

  updateContact(params: ContactModel): any {}

  getAllContacts(): Observable<any> {
    return from(this.contacts);
  }
}
