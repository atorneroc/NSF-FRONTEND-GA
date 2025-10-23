import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { BusinessGroupRepository } from 'src/app/core/repositories/businessGroup.repository';

@Injectable({
    providedIn: 'root'
})
export class BusinessMockRepository extends BusinessGroupRepository {
    businessGroups = [
        {
            id: 3,
            code: 'GE1',
            description: 'Grupo Empresarial A'
        },
        {
            id: 4,
            code: 'GE2',
            description: 'Grupo Empresarial B'
        }
    ];

    constructor() {
        super();
    }

    getAllBusinessGroups(): Observable<ParamsModel> {
        return from(this.businessGroups)
    }

}
