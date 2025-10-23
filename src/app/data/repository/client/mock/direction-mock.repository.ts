import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { DirectionModel } from 'src/app/core/models/direction.model';
import { DirectionRepository } from 'src/app/core/repositories/direction.repository';


@Injectable({
    providedIn: 'root'
})
export class DirectionMockRepository extends DirectionRepository {

    constructor() {
        super();
    }

    directions = [
        {
            direction: 'Av. Rivero Navarrete',
            postalCode: '15021',
            ubigeo: '122-445',
            province: 'Lima',
            typeDirection: 'Dirección Fiscal',
            country: 'Perú',
            status: 'Active',
            district: 'La Molina'
        }
    ]

    registerDirection(body: DirectionModel): any {
        console.log('RESPONSEEEE XD', body)
        return from([{}])
    }

    updateDirection(body: DirectionModel): any {}

    getAllDirections(): Observable<any> {
        return from(this.directions)
    }
}
