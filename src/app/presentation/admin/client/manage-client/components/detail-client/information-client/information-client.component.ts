import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { UpdateClientComponent } from '../../update-client/update-client.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../../../../../../common/shared/components/loader/loader.service';
import { GetAdditionalDataUsecase } from '../../../../../../../core/usecase/client/client/get-all-additional-data.usecase';
import { ParameterModel } from '../../../../../../../core/models/parameter.model';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';

@Component({
    selector: 'app-information-client',
    templateUrl: './information-client.component.html',
    styleUrls: ['./information-client.component.scss'],
})

export class InformationClientComponent implements OnInit {

    isVisibleAdditionalData = false;
    isClientChecked = true;

    client: ClientModel
    idClient: number

    formAdditionalData: FormGroup;

    additionalData: any[] = [];
    selectedAddtionalData: any[] = [];

    constructor(
        public loaderService: LoaderService,
        public dialogService: DialogService,
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _getClientById: GetClientByIdUsecase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAdditionalData: GetAdditionalDataUsecase,
    ) { }

    ngOnInit() {
        this._route.params.subscribe(params => {
            this.idClient = params['id']
            this.getClientById(this.idClient)
        })

        this.getListAdditionalData().then(() => {
            this.getAdditionalDataClient(this.idClient)
        })
    }

    createFormClient() {
        this.formAdditionalData = this._formBuilder.group({
            value: [null],
            description: [null]
        });
    }

    async getClientById(idClient: number) {

        try {
            const response: ResponseData<ClientModel> = await this._getClientById.execute(idClient)
            this.client = response.data
        }
        catch (error) {
            console.log(error)
        }
    }

    async getListAdditionalData() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("18")
            this.additionalData = response.data
        }
        catch (error) {
            console.error(error);
        }
    }

    async getAdditionalDataClient(idClient: number) {
        try {
            const response: any = await this._getAdditionalData.execute(idClient)
            const data = response.data.filter((element: any) => element.status === true);
            this.selectedAddtionalData = this.homologateDataClient(data)
        }
        catch (error) {
            console.error(error);
            this.selectedAddtionalData = [];
        }
    }

    homologateDataClient(selectedAddtionalData: Array<any>): Array<any> {
        return selectedAddtionalData.map(item => {
            const [dataAdditional] = this.additionalData.filter(data => data.id === item.type_Parameter)
            return {
                id: item.type_Parameter,
                description: dataAdditional.description,
                name: dataAdditional.name,
                attribute_length: 0
            }
        })
    }

    showModalUpdateClient() {

        const ref = this.dialogService.open(UpdateClientComponent, {
            data: this.idClient,
            header: 'Actualizar Cliente',
            width: '75rem',
        });

        ref.onClose.subscribe(() => {
            this.getClientById(this.idClient)
            this.getAdditionalDataClient(this.idClient)
        })
    }

    toggleAdditionalData() {
        this.isVisibleAdditionalData = !this.isVisibleAdditionalData;
    }

}
