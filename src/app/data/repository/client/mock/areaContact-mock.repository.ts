import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { AreaContactRepository } from 'src/app/core/repositories/areaContact.repository';

@Injectable({
    providedIn: 'root'
})
export class AreaContactMockRepository extends AreaContactRepository {
    areaContacts = [
        {
            id: 17,
            code: '003',
            description: 'Area contacto A'
          },
          {
            id: 18,
            code: '003',
            description: 'Area contacto B'
          },
    ];

    constructor() {
        super();
    }

    getAllAreaContacts(): Observable<ParamsModel> {
        return from(this.areaContacts)
    }

}
