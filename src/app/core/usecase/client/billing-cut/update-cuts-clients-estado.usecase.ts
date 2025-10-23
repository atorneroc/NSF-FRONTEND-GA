import { Injectable } from '@angular/core';
import { UseCasePromise } from "src/app/core/base/use-case-promise";
import { CutsClientEstadoRequest } from 'src/app/core/models/client/request/couts-client-status.request';
import { BillingCutRepository } from 'src/app/core/repositories/client/billing-cut.repository';
import { AutomaticResponse } from 'src/app/core/models/client/responses/automatic.response';
import { ResponseData } from 'src/app/core/models/response.model';


@Injectable({
  providedIn: 'root'
})
export class UpdateCutsClientsEstadoUsecase implements UseCasePromise<CutsClientEstadoRequest, AutomaticResponse> {
    
      constructor(
          private _billingCutRepository: BillingCutRepository
      ) { }

  execute(request: CutsClientEstadoRequest): Promise<ResponseData<AutomaticResponse>> {
    return this._billingCutRepository.updateCutClientsEstado(request);
  }

}