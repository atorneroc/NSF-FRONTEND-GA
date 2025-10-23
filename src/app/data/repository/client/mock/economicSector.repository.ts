import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { EconomicSectorRepository } from 'src/app/core/repositories/economicSector.repository';

@Injectable({
    providedIn: 'root'
})
export class EconomicSectorMockRepository extends EconomicSectorRepository {
    economicSector = [
        {
            id: 5,
            code: 'ES1',
            description: 'TEXTIL'
        },
        {
            id: 6,
            code: 'ES2',
            description: 'MINERAL'
        },
        {
            id: 7,
            code: 'ES1',
            description: 'CONSTRUCCION'
        },
        {
            id: 8,
            code: 'ES2',
            description: 'PESCA'
        },
        {
            id: 9,
            code: 'ES2',
            description: 'AGRICULTURA'
        },
        {
            id: 10,
            code: 'ES1',
            description: 'SERVICIOS'
        },
        {
            id: 11,
            code: 'ES2',
            description: 'FINANCIERO'
        }
    ];

    constructor() {
        super();
    }

    getAllEconomicSector(): Observable<ParamsModel> {
        return from(this.economicSector)
    }

}
