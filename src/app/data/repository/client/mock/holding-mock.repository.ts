import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { HoldingRepository } from 'src/app/core/repositories/holding.repository';

@Injectable({
    providedIn: 'root'
})
export class HoldingMockRepository extends HoldingRepository {
    holding = [
        {
            id: 12,
            code: 'HOO1',
            description: 'Holding A'
        },
        {
            id: 13,
            code: 'H002',
            description: 'Holding B'
        }
    ];

    constructor() {
        super();
    }

    getAllHoldings(): Observable<ParamsModel> {
        return from(this.holding)
    }

}
