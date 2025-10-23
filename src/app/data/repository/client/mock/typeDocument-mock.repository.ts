import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { TypeDirectionRepository } from 'src/app/core/repositories/typeDirection.repository';

@Injectable({
    providedIn: 'root'
})
export class TypeDirectionMockRepository extends TypeDirectionRepository {
    typeDirection = [
        {
            id: 1,
            code: '0001',
            description: 'Dirección Operativa',
          },
          {
            id: 2,
            code: '0002',
            description: 'Dirección Fiscal',
          }
    ];

    constructor() {
        super();
    }

    getAllTypeDirection(): Observable<ParamsModel> {
        return from(this.typeDirection)
    }

}
