import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { CoinRepository } from 'src/app/core/repositories/coin.repository';


@Injectable({
    providedIn: 'root'
})
export class CoinMockRepository extends CoinRepository {
    coins = [
        {
            id: 1,
            code: 'PSOL',
            description: 'Sol'
        },
        {
            id: 2,
            code: 'EEUU-DOLAR',
            description: 'Dólar'
        }
    ];

    constructor() {
        super();
    }

    getAllCoins(): Observable<ParamsModel> {
        return from(this.coins)
    }

}
