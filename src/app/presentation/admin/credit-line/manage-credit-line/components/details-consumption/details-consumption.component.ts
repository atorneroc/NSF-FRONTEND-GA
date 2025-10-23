import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup  } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetCreditLineByIdUsecase } from '../../../../../../core/usecase/credit-line/get-credit-line-by-id.usecase';
import { GetProductByCompanyBusinessUnitResponse } from 'src/app/core/models/utils/responses/get-product-by-company-business-unit.response';
import { GetBusinessUnitByCompanyResponse } from 'src/app/core/models/utils/responses/get-business-unit-by-company.model';
import { ClientModel } from 'src/app/core/models/client.model';
import { CollectionManagerResponse } from 'src/app/core/models/utils/responses/collection-manager.response';
import { Subscription } from 'rxjs';

import { GetCreditLineByIdClientRequest } from 'src/app/core/models/credit-line/request/get-credit-line-by-id-cliente.request';
import { GetCreditLineByIdClientResponses } from 'src/app/core/models/credit-line/response/get-credit-line-by-id-client.response';
import { GetConsumptionByIdClientResponses } from 'src/app/core/models/credit-line/response/get-consumption-by-id-client.response';
import { GetCreditLineByIdClientUseCase } from 'src/app/core/usecase/credit-line/get-credit-line-by-id-clients.usecase';
import { GetConsumptionByIdClientUseCase } from 'src/app/core/usecase/credit-line/get-consumption-by-id-clients.usecase';
import { SICCSA, SICCSA_LABEL, SLI_LABEL } from 'src/app/common/helpers/constants/company_type.constants';
import { GetCreditLineByIdResponse } from 'src/app/core/models/credit-line/response/get-credit-line-by-id.response';
import { CreditLineStatus } from 'src/app/common/helpers/enums/credit-line-payment-method.enum';
import { BranchService } from 'src/app/core/application/services/branch.service';

@Component({
    selector: 'details-consumption.component',
    templateUrl: './details-consumption.component.html',
    styleUrls: ['./details-consumption.component.scss'],
})

export class DetailsConsumptionComponent implements OnInit, OnDestroy {

    CreditLineId: number;
    amountLineMinValue: number = 1
    overdraftPercentageMaxValue: number = 100
    overdraftPercentageMinValue: number = 1
    isCounted: boolean = true
    isLoading = true;
    hasConsumption: boolean = false

    unlimitedCredit: boolean = false
    creditLine: boolean = false
    client : ClientModel

    lCreditLines: GetCreditLineByIdClientResponses[] = [];
    creditLineResponse: GetCreditLineByIdResponse

    companies: ParameterModel[] = [];
    modalities: ParameterModel[] = [];
    filteredModalities: ParameterModel[] = [];
    currency: ParameterModel[] = [];
    bankList: ParameterModel[] = [];
    financingList: ParameterModel[] = [];
    collectionManagerList: CollectionManagerResponse[] = []
    destroySubscribe: Subscription
    maxLengthAmountLineDirect: number = 5
    maxLengthAmountLineIndirect: number = 8
    rates_detail: FormArray;
    courts: ParameterModel[] = [];
    businessUnits: GetBusinessUnitByCompanyResponse[] = [];
    products: GetProductByCompanyBusinessUnitResponse[] = [];
    isDisableAddButton: boolean = true
    id_company: number
    id_Client:number
    SICCSA: number = SICCSA;
    SICCSA_LABEL: string = SICCSA_LABEL;
    SLI_LABEL: string = SLI_LABEL;
    creditLineDetailTotal: number = 0;
    form: FormGroup;
    items: any[] = [];
    constructor(
        public validateService: ValidateInputService,
        public loaderService: LoaderService,
        private _config: DynamicDialogConfig,
        private _getCreditLineById: GetCreditLineByIdUsecase,
        private _getCreditLineByIdClient: GetCreditLineByIdClientUseCase,
        private _getConsumptionByIdClient: GetConsumptionByIdClientUseCase,
        private cdr: ChangeDetectorRef,
        private _branchService: BranchService
    ) { 
        this.form = new FormGroup({});
    }

    async ngOnInit() {
        this.CreditLineId = this._config.data.CreditLine
        this.initCreditline();       
    }

    async initCreditline(){
        try {
        const response: ResponseData<GetCreditLineByIdResponse> = await this._getCreditLineById.execute(this.CreditLineId)
        this.creditLineResponse = response.data
            if(response.data){
                this.id_company = response.data.id_Company;
                this.id_Client =  response.data.id_Client;
                await this.DetailsCretitLine(response.data.id_Client, response.data.id_Company)
            }else{
                console.log("No hay datos disponibles");
            }
        }
        catch (error) {
        console.log(error)
        }
    }

    ngOnDestroy() {
        if(this.destroySubscribe)  this.destroySubscribe.unsubscribe()
    }

    DetailsCretitLine(idClient: number, idCompany: number): Promise<void> {
        const request: GetCreditLineByIdClientRequest = {
            Id_Client: idClient,
            Id_Company: idCompany
        };
    
        return this._getCreditLineByIdClient.execute(request)
            .then((responseData: ResponseData<GetCreditLineByIdClientResponses[]>) => {
                this.lCreditLines = Array.isArray(responseData.data) ? responseData.data : [responseData.data];
                this.DetailsListConsumption(idClient, idCompany)
                // this.cdr.detectChanges();
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    selectAll() {
        this.items.forEach(item => item.selected = true);
    }
    
    isAllSelected(): boolean {
        // return this.items.filter(item => item.selected);
        // return this.items.filter(item => item.selected).length;
        return this.items.some(item => item.selected);
    }

    // onCheckboxChange(event: any): void {
    //     const isChecked = event.target.checked;
        
    //     const index = event.target.id.split('_')[1]; // Obtener el rowIndex desde el id del checkbox
    //     this.items[index].selected = isChecked;
    //     this.calculateTotal();
    // }
    
    onCheckboxChange(event: any, rowIndex: number): void {
        const isChecked = event.target.checked;
        this.items[rowIndex].selected = isChecked;
        this.calculateTotal();
    }

      // Método para calcular el total si todos están seleccionados
    calculateTotal(){

        if (this.isAllSelected()) {
            this.creditLineDetailTotal = this.items
            .filter(item => item.selected)  // Filtra solo los seleccionados
            .reduce((sum, item) => sum + item.sales_Price_Amount, 0); 
        } else {
        this.creditLineDetailTotal = 0; // Si no todos están seleccionados, no calculamos el total
        }
    }

    DetailsListConsumption(idClient: number, idCompany: number): Promise<void> {

        const request: GetCreditLineByIdClientRequest = {
            Id_Client: idClient,
            Id_Company: idCompany
        };
    
        return this._getConsumptionByIdClient.execute(request)
            .then((responseData: ResponseData<GetConsumptionByIdClientResponses[]>) => {
                this.items  = Array.isArray(responseData.data) ? responseData.data : [responseData.data];

                this.form = new FormGroup({});

                // Agregar un control para cada item
                this.items.forEach((item, index) => {
                  this.form.addControl(`checkbox_${index}`, new FormControl(item.selected));
                });

                this.calculateTotal();
                // this.cdr.detectChanges();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getStatusToCreditLine(code_status: string): string {
        const status = code_status as CreditLineStatus;
        return this._branchService.CreditLineCssClass[status] ?? '';
    }
}
