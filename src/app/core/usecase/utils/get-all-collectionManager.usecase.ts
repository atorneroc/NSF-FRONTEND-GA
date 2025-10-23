import { Injectable } from '@angular/core';
import { UtilsRepository } from '../../repositories/utils/utils.repository';
import { ResponseData } from '../../models/response.model';
import { UseCasePromise } from '../../base/use-case-promise';
import { CollectionManagerResponse } from '../../models/utils/responses/collection-manager.response';

@Injectable({
    providedIn: 'root'
})

export class GetAllCollectionManagerUsecase implements UseCasePromise<string, CollectionManagerResponse[]> {

    constructor(
        private _utilsRepository: UtilsRepository
    ) { }

    execute(profileId: string): Promise<ResponseData<CollectionManagerResponse[]>> {
        return this._utilsRepository.getAllCollectionManager(profileId);
    }
}
