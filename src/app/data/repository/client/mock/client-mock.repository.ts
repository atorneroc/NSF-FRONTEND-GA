import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ClientModel } from 'src/app/core/models/client.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';


@Injectable({
    providedIn: 'root'
})
export class ClientMockRepository extends ClientRepository {
    clients = [
        {
            'codigoUnico': '00441',
            'ruc': '20500624972',
            'razonSocial': 'Las Torres del cruzero'
        },
        {
            'codigoUnico': '00441',
            'ruc': '20500624972',
            'razonSocial': 'Las Torres del cruzero'
        },
        {
            'codigoUnico': '00441',
            'ruc': '20500624972',
            'razonSocial': 'Las Torres del cruzero'
        },
        {
            'codigoUnico': '00441',
            'ruc': '20500624972',
            'razonSocial': 'Las Torres del cruzero'
        },
        {
            'codigoUnico': '00441',
            'ruc': '20500624972',
            'razonSocial': 'Las Torres del cruzero'
        }
    ];

    constructor() {
        super();
    }

    getAllClients(): Observable<ClientModel> {
        return from(this.clients)
    }
    getClientById(): Observable<ClientModel> {
      throw new Error('Method not implemented.');
    }

    createClient(body: ClientModel): any {
        console.log('RESPONSE', body)
        return from([{}])
    }
}
