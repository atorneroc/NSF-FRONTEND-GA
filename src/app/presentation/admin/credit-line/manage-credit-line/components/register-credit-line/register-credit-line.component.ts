import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { AlertService } from "src/app/common/shared/services/alert.service";
import { invalid } from "src/app/common/helpers/constants/alert.constants";
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { RegisterCreditLineUsecase } from 'src/app/core/usecase/credit-line/register-credit-line.usecase';
import { CreditLineModel } from 'src/app/core/models/credit-line.model';
import { setDateFormat } from "src/app/common/validator/date";
import { customValidator, equalLength } from 'src/app/common/validator/validator';
import { DebounceUtil } from 'src/app/common/helpers/utils/debounce.util';
import { VirtualScroller } from 'primeng/virtualscroller';
import { GetUnitByCompanyUseCase } from 'src/app/core/usecase/utils/get-unit-by-company.usecase';
import { GetBusinessUnitByCompanyResponse } from 'src/app/core/models/utils/responses/get-business-unit-by-company.model';
import { GetProductByCompanyBusinessUnitUseCase } from 'src/app/core/usecase/utils/get-product-by-company-business-unit.usecase';
import { GetProductByCompanyBusinessUnitRequest } from 'src/app/core/models/utils/request/get-business-unit-by-company.request';
import { GetProductByCompanyBusinessUnitResponse } from 'src/app/core/models/utils/responses/get-product-by-company-business-unit.response';
import { RegisterCreditLineRequest } from 'src/app/core/models/credit-line/request/register-credit-line.request';
import { GetClientWithRucByNameUsecase } from 'src/app/core/usecase/client/client/get-client-with-ruc-bye-name.usecase';
import { Subscription } from 'rxjs';
import { CollectionManagerResponse } from 'src/app/core/models/utils/responses/collection-manager.response';
import { GetAllCollectionManagerUsecase } from 'src/app/core/usecase/utils/get-all-collectionManager.usecase';
import { AutoComplete } from 'primeng/autocomplete';
import { BranchService } from 'src/app/core/application/services/branch.service';
import { ClientTypeParameter } from 'src/app/common/helpers/constants/client_type.constants';

@Component({
    selector: 'register-credit-line',
    templateUrl: './register-credit-line.component.html',
    styleUrls: ['./register-credit-line.component.scss'],
})

export class RegisterCreditLineComponent implements OnInit, OnDestroy {
  @ViewChild('virtual_scroll')virtualScroll : VirtualScroller;
  @ViewChild('client_code') clientcodeAutocomplete: AutoComplete;
  
    clients: any[] = [];
    formCreditLine: FormGroup;
    amountLineMinValue: number = 1
    overdraftPercentageMaxValue: number = 100
    overdraftPercentageMinValue: number = 1
    currentDate: Date = new Date()
    // Parametros a consumir
    status: ParameterModel[] = [];
    companies: ParameterModel[] = [];
    modalities: ParameterModel[] = [];
    filteredModalities: ParameterModel[] = [];
    currency: ParameterModel[] = [];
    bankList: ParameterModel[] = [];
    financingList: ParameterModel[] = [];
    numberDigitsList: ParameterModel[] = [];
    collectionManagerList: CollectionManagerResponse[] = []
    maxLengthAmountLineDirect: number;
    maxLengthAmountLineIndirect: number = 8
    rates_detail: FormArray;
    courts: ParameterModel[] = [];
    businessUnits: GetBusinessUnitByCompanyResponse[] = [];
    products: GetProductByCompanyBusinessUnitResponse[] = [];
    isDisableAddButton: boolean = true
    destroySubscribe: Subscription

    clientList: any[] = [];
    isGetClientByFilterActive: boolean = false;
    typeClient: string;

    constructor(
        public validateService: ValidateInputService,
        public loaderService: LoaderService,
        private _formBuilder: FormBuilder,
        private _dialogRef: DynamicDialogRef,
        private _alertService: AlertService,
        private _getParameterById: GetParameterByIdUseCase,
        private _getClientByName: GetClientWithRucByNameUsecase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getAllModalities: GetParameterByIdUseCase,
        private _registerCreditLine: RegisterCreditLineUsecase,
        private _getUnitByCompany: GetUnitByCompanyUseCase,
        private _getProductByCompanyBusinessUnitUseCase: GetProductByCompanyBusinessUnitUseCase,
        private _getAllCollectionManager: GetAllCollectionManagerUsecase,
        private _branchService: BranchService,
    ) { }

    ngOnInit(): void {
    this.initialize();
    }

    private async initialize(): Promise<void> {
    const maxLength = await this.getMaximumMumber();
    this.maxLengthAmountLineDirect = maxLength;

    this.createFormCreditLine();
    this.filterModality();
    this.getAllCompanies();
    this.getAllCoins();
    this.getAllModalities();
    this.initFormDetailCourtData();
    this.getAllCourts();
    this.getAllCollectionManager();
    this.getAllBanks();
    this.getAllFinancing();
    this.getChangesForm();
    }


    ngOnDestroy() {
        if(this.destroySubscribe)  this.destroySubscribe.unsubscribe()
    }

      createFormCreditLine() {
        this.formCreditLine = this._formBuilder.group({
            // INFORMACION DE CLIENTE
            id_Client: [null, Validators.required],
            document_number: [null, Validators.required],
            commercial_segmentation: [null],
            sap_Code: [null],
            // CREDITO DIRECTO
            id_Company_direct_credit: [null, Validators.required],
            issue_date_direct_credit: [this.currentDate, Validators.required],
            id_Modality_direct_credit: [null, Validators.required],
            id_Money_direct_credit: [null, Validators.required],
            collection_manager_direct_credit: [null, Validators.required],
            line_direct_credit: [null, [Validators.required, Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineDirect)]],
            overdraft_Percentage: [20, [Validators.required, Validators.min(this.overdraftPercentageMinValue), Validators.max(this.overdraftPercentageMaxValue)]],
            observations_direct_credit: [null],

            // CREDITO INDIRECTO
            id_Company_indirect_credit: [null],
            id_bank_indirect_credit: [null],
            id_financing_indirect_credit: [null],
            id_Money_indirect_credit: [null],
            line_indirect_credit: [null, [Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineIndirect)]],
            id_Modality_indirect_credit: [null],
            tea_Percentage: [null, [Validators.min(this.overdraftPercentageMinValue), Validators.max(this.overdraftPercentageMaxValue)]],
            observations_indirect_credit: [null],
        });
    }

    initFormDetailCourtData() {
      this.rates_detail = this._formBuilder.array([])
      // for (let i = 0; i < 1; i++) {
      //   this.registerDetail(i);

      // }
    }

    getDetailCourtForm(form) {
      return form as FormGroup;
    }

    get DetailCourtDataArray() {
        return this.rates_detail as FormArray;
    }

    registerDetail(position?: number){

      const form = this._formBuilder.group({
          id_business_unit: [null, Validators.required],
          id_product: [null],
          id_court: [null, Validators.required],
          index: [position],
          productsList: [[]]
      });

      this.rates_detail.push(form);

    }

    getClientDebounce(value: any) {
        DebounceUtil.apply(() => {
            this.getClientByName(value)
        })
    }

    async getClientByName(value: any) {
        try {
            this.clients = [];
            if (!value) return;
            const response: any = await this._getClientByName.execute(value);
            this.clients = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllCompanies() {
        try {
            const response: ResponseData<ParameterModel[]> =
                await this._getAllcompanies.execute();
            this.companies = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async onChangeCompany(id_Company: number) {
        try {
            this.isDisableAddButton = true
            this.initFormDetailCourtData()
            if (id_Company!=null) {
              const response: ResponseData<GetBusinessUnitByCompanyResponse[]> =
              await this._getUnitByCompany.execute(id_Company);
              this.businessUnits = response.data;
              this.isDisableAddButton = false

            }

        } catch (error) {
            console.log('Error: ', error);
            this.isDisableAddButton = true
        }
    }

    async onChangeBusinessUnit(id_Business_Unit: number, serviceIndex: number) {
        try {
            const form = this.formCreditLine.value
            if (id_Business_Unit != null) {
                let request: GetProductByCompanyBusinessUnitRequest = {
                    Id_Business_Unit: id_Business_Unit,
                    Id_Company: form.id_Company_direct_credit
                }
                const response: ResponseData<GetProductByCompanyBusinessUnitResponse[]> =
                    await this._getProductByCompanyBusinessUnitUseCase.execute(request);
                //this.products = response.data;

                // Actualiza solo el FormGroup específico
                const specificForm = this.rates_detail.at(serviceIndex) as FormGroup;
                specificForm.get('productsList').setValue(response.data);

            }

        } catch (error) {
            console.log('Error: ', error);
            this.isDisableAddButton = true
        }
    }
    async getAllCourts() {
        try {
          const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("TCORFAC")
            this.courts = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllModalities() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("22")
            this.modalities = response.data
            this.filterModality()
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllCoins() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("1")
            this.currency = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllBanks() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("TIPOENTIDADFINANCIERA")
            this.bankList = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllFinancing() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("TIPOFINANCIACION")
            this.financingList = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllCollectionManager() {

        try {
            const response: ResponseData<CollectionManagerResponse[]> = await this._getAllCollectionManager.execute("001")
            this.collectionManagerList = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getMaximumMumber(): Promise<number | null> {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("CANTLC");
            this.numberDigitsList = response.data;
            const selectedNumberDigits = this.numberDigitsList.find(item => item.detail_code === 'CANTLCD');
            return selectedNumberDigits ? selectedNumberDigits.max_val : null;
        } catch (error) {
            console.log("Error: ", error);
            return null;
        }
    }

    async registerCreditLine() {
        if (this.formCreditLine.invalid) {
            this._alertService.warn(invalid)
            this.formCreditLine.markAllAsTouched()
            return
        }
        if (this.rates_detail.invalid) {
            this._alertService.warn(invalid)
            this.rates_detail.markAllAsTouched()
            return
        }
        const form = this.formCreditLine.value

        const creditLine: RegisterCreditLineRequest = {
            id_Client: form.id_Client.id,
            // CREDITO DIRECTO
            id_Company: form.id_Company_direct_credit,
            payment_modality_id: form.id_Modality_direct_credit,
            id_Money: form.id_Money_direct_credit,
            start_Date: setDateFormat(new Date()),
            broadcast_date: setDateFormat(form.issue_date_direct_credit),
            overdraft_Percentage: form.overdraft_Percentage,
            amount_Line: form.line_direct_credit,
            collection_manager_id: form.collection_manager_direct_credit,
            observation: form.observations_direct_credit,
            // CREDITO INDIRECTO
            indirect_company_id: form.id_Company_indirect_credit,
            indirect_financial_entity_id: form.id_bank_indirect_credit,
            indirect_financing_type_id: form.id_financing_indirect_credit,
            indirect_currency_type_id: form.id_Money_indirect_credit,
            indirect_awarded_line_amount: form.line_indirect_credit,
            indirect_payment_modality_id: form.id_Modality_indirect_credit,
            indirect_tea_percentage: form.tea_Percentage,
            indirect_observation: form.observations_indirect_credit,
            //// DATOS EXTRA //////////
            ind_credit_line: 0,
            user: localStorage.getItem('username'),
            status: 237
        }

        try {
            const response: any = await this._registerCreditLine.execute(creditLine)

            this._alertService.success(response.message)

            this.close()
        }

        catch (error) {
            //this._alertService.error(error.error.Error[0])
        }
    }

    getChangesForm() {
        const fieldsToObserve = [
            'id_Company_indirect_credit',
            'id_bank_indirect_credit',
            'id_financing_indirect_credit',
            'id_Money_indirect_credit',
            'line_indirect_credit',
            'id_Modality_indirect_credit',
            'tea_Percentage',
            'observations_indirect_credit'
        ];
      
        fieldsToObserve.forEach(field => {
          this.destroySubscribe = this.formCreditLine.get(field).valueChanges.subscribe(() => {
            this.setIndirectCreditLineRequired(field);
          });
        });
    }


    setIndirectCreditLineRequired(field: string) {
        const form = this.formCreditLine
        const company = form.get('id_Company_indirect_credit').value
        const bank = form.get('id_bank_indirect_credit').value
        const financing = form.get('id_financing_indirect_credit').value
        const currency = form.get('id_Money_indirect_credit').value
        const crediteLine = form.get('line_indirect_credit').value
        const modality = form.get('id_Modality_indirect_credit').value
        const teaPercentage = form.get('tea_Percentage').value
        const observation = form.get('observations_indirect_credit').value
        const input = this.formCreditLine.get([field]).value;
        
        if(input) {
            form.get('id_Company_indirect_credit').setValidators(Validators.required)
            form.get('id_Company_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_bank_indirect_credit').setValidators(Validators.required)
            form.get('id_bank_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_financing_indirect_credit').setValidators(Validators.required)
            form.get('id_financing_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_Money_indirect_credit').setValidators(Validators.required)
            form.get('id_Money_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('line_indirect_credit').setValidators([Validators.required, Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineIndirect)])
            form.get('line_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_Modality_indirect_credit').setValidators(Validators.required)
            form.get('id_Modality_indirect_credit').updateValueAndValidity({emitEvent: false})
        }

        if(!company && !bank && !financing && !currency && !crediteLine && !modality && !teaPercentage && !observation) {
            form.get('id_Company_indirect_credit').clearValidators()
            form.get('id_Company_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_bank_indirect_credit').clearValidators()
            form.get('id_bank_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_financing_indirect_credit').clearValidators()
            form.get('id_financing_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_Money_indirect_credit').clearValidators()
            form.get('id_Money_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('line_indirect_credit').clearValidators()
            form.get('line_indirect_credit').updateValueAndValidity({emitEvent: false})
            form.get('id_Modality_indirect_credit').clearValidators()
            form.get('id_Modality_indirect_credit').updateValueAndValidity({emitEvent: false})
        }
    }

    selectClient(event) {
        // const client = this.clients.find(item => item.id === event.value)
        const client = event
        this.formCreditLine.get('document_number').reset()
        this.formCreditLine.get('commercial_segmentation').reset()
        this.formCreditLine.get('sap_Code').reset()
        this.formCreditLine.patchValue({
            document_number: client.identity_number_document,
            commercial_segmentation: client.commercial_name,
            sap_Code: client.code_sap
          });
        // this.formCreditLine.patchValue(client)
    }

    filterModality() {
        this.filteredModalities = this.modalities
          .filter(value => value.id !== 228)
          .sort((a, b) => a.attribute_length - b.attribute_length);
    }


    validateOnlyNumber(event: any) {
        const charCode = (event.which) ? event.which : event.keycode

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false
        }
        return true
    }

    removeDetail(index: number) {
        if (this.rates_detail.length > 0) {
            this.rates_detail.removeAt(index);
        }
    }

    close() {
        this._dialogRef.close()
    }

    async getClient(query: string): Promise<void> {
        this.isGetClientByFilterActive = true;
        this.typeClient = ClientTypeParameter.CLIENTE //Solo tipo de cliente 
        try {
          const clients = await this._branchService.getClientCreditLine(
            query,
            this.typeClient,
            this.isGetClientByFilterActive
          );
          this.clientList = clients;
        } catch (error) {
          console.error('Error al recuperar clientes:', error);
        }
    }

    handleClearClient($event): void {
        this.formCreditLine.get('id_Client')?.reset(); // Primero reseteá
        this.formCreditLine.get('document_number')?.reset();
        this.formCreditLine.get('commercial_segmentation')?.reset();
        this.formCreditLine.get('sap_Code')?.reset();
        const form = this.formCreditLine.getRawValue();    // Después obtené el valor actualizado                            
        // // Ahora sí, sin cliente
        this.clientList = [];
        this.selectClient($event);
    }

}
