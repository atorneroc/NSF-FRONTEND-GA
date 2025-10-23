import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientModel } from 'src/app/core/models/client.model';
import { CreditLineModel } from 'src/app/core/models/credit-line.model';
import { GetCreditLineByIdClientResponse } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-cliente.response';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { GetCreditLineByIdClientUseCase } from 'src/app/core/usecase/credit-line/get-credit-line-by-id-client.usecase';

@Component({
  selector: 'app-credit-line',
  templateUrl: './credit-line.component.html',
  styleUrls: ['./credit-line.component.scss']
})

export class CreditLineComponent implements OnInit {

    lCreditLines: GetCreditLineByIdClientResponse[] = []
    creditLine: CreditLineModel
    client: ClientModel

    idClient: number

    constructor(
        private _route: ActivatedRoute,
        private _getCreditLineByIdClient: GetCreditLineByIdClientUseCase,
        private _getClientById: GetClientByIdUsecase,
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.idClient = params['id']
            this.getClientById(this.idClient)
            this.getCreditLineByIdClient(this.idClient);
        })
    }

    async getClientById(idClient: number) {
        try {
            let data: ResponseData<ClientModel> = await this._getClientById.execute(idClient)
            this.client = data.data
        }
        catch (error) {
            console.log(error)
        }
    }

    async getCreditLineByIdClient(idClient: number) {
        try {
            const response: ResponseData<GetCreditLineByIdClientResponse[]> = await this._getCreditLineByIdClient.execute(idClient)
            this.lCreditLines = response.data
        }
        catch (error) {
            console.log(error)
        }
    }

}
