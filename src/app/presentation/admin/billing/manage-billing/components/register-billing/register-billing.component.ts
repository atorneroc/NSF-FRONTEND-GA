import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseData } from 'src/app/core/models/response.model';
import { CreditLineModel } from 'src/app/core/models/credit-line.model';
import { GetExchangeRateUseCase } from 'src/app/core/usecase/utils/get-exchange-rate.usecase';
import { GetCreditLineByIdClientUseCase } from 'src/app/core/usecase/credit-line/get-credit-line-by-id-client.usecase';
import { ClientModel } from 'src/app/core/models/client.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { AddressModel } from 'src/app/core/models/address.model';
import { GetAllAddressByClientIdUsecase } from 'src/app/core/usecase/client/address/get-all-address-by-client-id.usecase';
import { GetClientByNameUsecase } from 'src/app/core/usecase/client/client/get-client-by-name.usecase';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { GetBranchOfficeById } from 'src/app/core/usecase/utils/get-branch-offices-by-id.usecase';
import { GetUnitByIdUseCase } from 'src/app/core/usecase/utils/get-units-by-id.usecase';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { invalid, success } from 'src/app/common/helpers/constants/alert.constants';
import { BillingModel } from 'src/app/core/models/billing.model';
import { setDateFormat } from 'src/app/common/validator/validator';
import { RegisterBillingUsecase } from 'src/app/core/usecase/billing/register-billing.usecase';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { GetUnitByCompanyBranchOfficeResponse } from 'src/app/core/models/utils/responses/get-unit-by-company-branchOffice';

@Component({
    selector: 'app-register-billing',
    templateUrl: './register-billing.component.html'
})

export class RegisterBillingComponent implements OnInit {

    address: string
    minEmittionDate: Date;
    daysBilling: number;
    exchangeRateValue: number

    formBilling: FormGroup

    lCompany: ParameterModel[] = []
    lUnit: ParameterModel[] = []
    lBranchOffice: ParameterModel[] = []
    lClient: ClientModel[] = []
    lTypeDocumentIdentity: ParameterModel[] = []
    Client: ClientModel

    constructor(
        private _getExchangeRate: GetExchangeRateUseCase,
        private _getCreditLine: GetCreditLineByIdClientUseCase,
        private _formBuilder: FormBuilder,

        private _getClientById: GetClientByIdUsecase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getBranchesById: GetBranchOfficeById,
        private _getClientByName: GetClientByNameUsecase,
        private _getUnitsById: GetUnitByIdUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllAddressByClientId: GetAllAddressByClientIdUsecase,
        private _registerBilling: RegisterBillingUsecase,
        private _dialogRef: DynamicDialogRef,
        private _messageService: AlertService,
    ) { }

    ngOnInit() {
        this.createFormBilling();
        this.getAllCompanies()
        this.getAllTypeDocumentIdentity()
        // this.getCreditLine()
        this.calcMinEmittionDate()
    }

    createFormBilling() {
        this.formBilling = this._formBuilder.group({
            company_id: [null],
            branch_office_id: [null],
            business_unit_id: [null],
            document_type_id: [null],
            client_id: [null],
            currency_type: [null],
            broadcast_date: [null],
            expiration_date: [null],
            comment: [null]
        })
    }

    async getClientByName(value: string) {
        try {
            this.lClient = []
            if (!value) return;

            setTimeout(async () => {
                const response: any = await this._getClientByName.execute(value)
                this.lClient = response.data
            }, 500);
        }
        catch (error) {
            console.log('Error: ', error)
        }
    }

    async getAllCompanies() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
            this.lCompany = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getBranchOfficeById(id: number) {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getBranchesById.execute(id)
            this.lBranchOffice = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllUnits(idCompany: number,  idBranchOffice: number) {

        try {
            //const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(id)
            const params: GetUnitByCompanyBranchOfficeResponse={idCompany: idCompany, idBranchOffice: idBranchOffice}
            const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(params);
            this.lUnit = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllTypeDocumentIdentity() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("10")
            this.lTypeDocumentIdentity = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getClientById(idClient: number) {

        try {

            let response: ResponseData<ClientModel> = await this._getClientById.execute(idClient)
            this.Client = response.data

            this.getAddressByClientId(idClient)
            this.formBilling.get('currency_type').setValue(this.Client.currency_Type)
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAddressByClientId(idClient: number) {
        try {
            let response: ResponseData<AddressModel[]> = await this._getAllAddressByClientId.execute(idClient)
            this.address = response.data[0]?.address;
        }
        catch (error) {
            console.log(error)
        }
    }

    async getExchangeRate(emissionDate: Date) {
        try {
            const year = emissionDate.getFullYear();
            const month = emissionDate.getMonth() + 1;
            const day = emissionDate.getDate();

            const formattedDate = `${year}-${month}-${day}`;

            const response: ResponseData<any> = await this._getExchangeRate.execute(formattedDate)
            this.exchangeRateValue = response.data.bank_purchase;
        }
        catch (error) {
            this.exchangeRateValue = null;
        }
    }

    // async getCreditLine() {
    //     try {

    //         const creditLine: CreditLineModel = {
    //             client_id: 24,
    //             company_id: 1,
    //         }
    //         const response: ResponseData<CreditLineModel> = await this._getCreditLine.execute(creditLine)
    //         this.daysBilling = response.data[0].days_billing;
    //     }
    //     catch (error) {
    //         this.daysBilling = null;
    //     }
    // }

    async registerBilling() {

        if (this.formBilling.invalid) {
            this._messageService.warn(invalid)
            this.formBilling.markAllAsTouched()
            return
        }

        const form = this.formBilling.value

        const billing: BillingModel = {
            type_param: 1,
            client_id: form.client_id,
            company_id: form.company_id,
            unit_id: form.business_unit_id,
            branch_office_id: form.branch_office_id,
            broadcast_date: setDateFormat(form.broadcast_date),
            expiration_date: setDateFormat(form.expiration_date),
            status: true,
            comment: form.comment,
            invoice_ticket_id: 1,
        }

        try {
            const response: any = await this._registerBilling.execute(billing)
            console.log(response)
            this._messageService.success(success)
            this.close()
        }

        catch (error) {
            console.log(error)
        }
    }

    getBranches() {
        const companyId = this.formBilling.value.company_id
        const branchOfficeId = this.formBilling.value.branch_office_id
        if (!companyId) return
        this.lBranchOffice = []
        this.lUnit = []
        this.getBranchOfficeById(companyId)
        this.getAllUnits(companyId, branchOfficeId)
    }

    getUnits() {
        const companyId = this.formBilling.value.company_id
        const branchOfficeId = this.formBilling.value.branch_office_id
        if (!branchOfficeId) return
        this.getAllUnits(companyId, branchOfficeId)
    }

    onChangeCompany() {
        this.formBilling.get('branch_office_id').reset()
        this.formBilling.get('business_unit_id').reset()
        this.getBranches()
    }

    onChangeBranch() {
        this.formBilling.get('business_unit_id').reset()
        this.getUnits()
    }

    onChangeEmittionDate(emissionDate: Date) {
        this.getExchangeRate(emissionDate);
        this.calcExpirationDate(emissionDate);
    }

    calcMinEmittionDate() {
        const minDate = new Date();
        const DIFF_DAYS = 3;

        minDate.setDate(minDate.getDate() - DIFF_DAYS);
        this.minEmittionDate = minDate
    }

    calcExpirationDate(emissionDate: Date) {
        const date = new Date(emissionDate);
        const days = this.daysBilling;

        date.setDate(date.getDate() + days);
        this.formBilling.get('expiration_date').setValue(date);
    }

    close() {
        this._dialogRef.close()
    }
}
