import { Injectable } from "@angular/core";
import { UseCasePromise } from "src/app/core/base/use-case-promise";
import { ResponseData } from 'src/app/core/models/response.model';
import { ClientRepository } from 'src/app/core/repositories/client/client.repository';

@Injectable({
  providedIn: 'root'
})
export class GetClientUsecase implements UseCasePromise<any, any> {

  constructor(
    private _clientRepository: ClientRepository
  ){}
    
  execute(request: any): Promise<ResponseData<any>> {
    return this._clientRepository.getClient(request);
  }

  executeGetCreditLineClients(request: any): Promise<ResponseData<any>> {
    return this._clientRepository.getCreditLineClients(request);
  }
}