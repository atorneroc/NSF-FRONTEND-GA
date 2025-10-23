import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { countriesModel } from '../../models/countries.model';

@Injectable({
    providedIn: 'root'
})

export class GetAllCountriesByIdUseCase implements UseCasePromise<number, countriesModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(id : number): Promise<ResponseData<countriesModel[]>> {

        return this._utilsRepository.getAllCountrieById(id);
    }
}
