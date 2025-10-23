import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { countriesModel } from '../../models/countries.model';

@Injectable({
    providedIn: 'root'
})

export class GetAllCountriessUseCase implements UseCasePromise<string, countriesModel[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(term: string = ''): Promise<ResponseData<countriesModel[]>> {

        return this._utilsRepository.getAllCountries(term);
    }
}
