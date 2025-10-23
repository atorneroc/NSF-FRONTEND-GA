import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { ubigeoModel } from '../../models/ubigeo.model';

@Injectable({
    providedIn: 'root'
})

export class GetAllLocationsByUbigeoId implements UseCasePromise<string, ubigeoModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(ubigeoId: string): Promise<ResponseData<ubigeoModel[]>> {

        return this._utilsRepository.getAllLocationsByUbigeoId(ubigeoId);
    }
}
