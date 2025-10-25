import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { invalid } from "src/app/common/helpers/constants/alert.constants";
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { CreditLineModel } from 'src/app/core/models/credit-line.model';
import { GetCreditLineByIdUsecase } from '../../../../../../core/usecase/credit-line/get-credit-line-by-id.usecase';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { UpdateCreditLineUsecase } from 'src/app/core/usecase/credit-line/update-credit-line.usecase';
import { CreditLinePaymentMethod } from 'src/app/common/helpers/enums/credit-line-payment-method.enum';
import { GetProductByCompanyBusinessUnitRequest } from 'src/app/core/models/utils/request/get-business-unit-by-company.request';
import { GetProductByCompanyBusinessUnitResponse } from 'src/app/core/models/utils/responses/get-product-by-company-business-unit.response';
import { GetProductByCompanyBusinessUnitUseCase } from 'src/app/core/usecase/utils/get-product-by-company-business-unit.usecase';
import { GetBusinessUnitByCompanyResponse } from 'src/app/core/models/utils/responses/get-business-unit-by-company.model';
import { GetCreditLineByIdResponse } from 'src/app/core/models/credit-line/response/get-credit-line-by-id.response';
import { GetUnitByCompanyUseCase } from 'src/app/core/usecase/utils/get-unit-by-company.usecase';
import { RegisterCreditLineRequest } from 'src/app/core/models/credit-line/request/register-credit-line.request';
import { ClientModel } from 'src/app/core/models/client.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { GetAllCollectionManagerUsecase } from 'src/app/core/usecase/utils/get-all-collectionManager.usecase';
import { CollectionManagerResponse } from 'src/app/core/models/utils/responses/collection-manager.response';
import { setDateFormat } from 'src/app/common/validator/date';
import { Subscription } from 'rxjs';
import { UpdateCreditLineConsumptionUseCase } from 'src/app/core/usecase/credit-line/update-creditLineConsumption.usecase';
import { UpdateCreditLineConsumptionRequest } from 'src/app/core/models/credit-line/request/update-credit-line-consumption.request';
import { de } from 'date-fns/locale';

@Component({
    selector: 'update-credit-line-comment',
    templateUrl: './update-credit-line.component.html',
    styleUrls: ['./update-credit-line.component.scss'],
})

export class UpdateCreditLineComponent implements OnInit, OnDestroy {

    idCreditLine: number;
    amountLineMinValue: number = 1
    overdraftPercentageMaxValue: number = 100
    overdraftPercentageMinValue: number = 1
    isCounted: boolean = true
    isLoading = true;
    hasConsumption: boolean = false

    unlimitedCredit: boolean = false
    creditLine: boolean = false

    formCreditLine: FormGroup;
    client : ClientModel
    creditLineResponse: GetCreditLineByIdResponse

    companies: ParameterModel[] = [];
    modalities: ParameterModel[] = [];
    filteredModalities: ParameterModel[] = [];
    currency: ParameterModel[] = [];
    bankList: ParameterModel[] = [];
    financingList: ParameterModel[] = [];
    numberDigitsList: ParameterModel[] = [];
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
    Id_State: ParameterModel[] = [];
    stateDetailCode: string;
    constructor(
        public validateService: ValidateInputService,
        public loaderService: LoaderService,
        private _formBuilder: FormBuilder,
        private _dialogRef: DynamicDialogRef,
        private _config: DynamicDialogConfig,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllModalities: GetParameterByIdUseCase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getAllStatus: GetParameterByIdUseCase,
        private _getCreditLineById: GetCreditLineByIdUsecase,
        private _updateCreditLine: UpdateCreditLineUsecase,
        private _UpdateCreditLineConsumption: UpdateCreditLineConsumptionUseCase,
        private _alertService: AlertService,
        private _getProductByCompanyBusinessUnitUseCase: GetProductByCompanyBusinessUnitUseCase,
        private _getUnitByCompany: GetUnitByCompanyUseCase,
        private _getClientById: GetClientByIdUsecase,
        private _getAllCollectionManager: GetAllCollectionManagerUsecase
    ) { }

    ngOnInit(): void {
    this.initialize();
    }

    private async initialize(): Promise<void> {
    const maxLength = await this.getMaximumMumber();
    this.maxLengthAmountLineDirect = maxLength;

    this.getAllStatusCreditLine();
    this.initFormDetailCourtData();

    this.idCreditLine = this._config.data.id_CreditLine;

    await this.createFormCreditLine();

    this.getAllCoins();
    this.getAllCompanies();
    await this.getAllModalities();

    this.getCreditLineById(this.idCreditLine);
    this.getAllCourts();
    this.getAllBanks();
    this.getAllFinancing();
    this.getAllCollectionManager();
    this.getChangesForm();
    }

    ngOnDestroy() {
        if(this.destroySubscribe)  this.destroySubscribe.unsubscribe()
    }

    createFormCreditLine() {
        this.formCreditLine = this._formBuilder.group({
            id_CreditLine: [null],

            // INFORMACION DE CLIENTE
            client_Name: [null, Validators.required],
            identity_Card_Number: [null, Validators.required],
            segmentation_Code_Description: [null],
            id_Sap: [null],
            creditLine: [null],
            operationalLock: [null],
            unlimitedCredit: [null],

            // CREDITO DIRECTO
            company_Name: [null, Validators.required],
            id_Company: [null],
            payment_modality_id: [null, Validators.required],
            amount_Line: [null, [Validators.required, Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineDirect)]],
            overdraft_Percentage: [20, [Validators.required, Validators.min(this.overdraftPercentageMinValue), Validators.max(this.overdraftPercentageMaxValue)]],
            id_Money: [{value:null, disabled:false}, Validators.required],
            issue_date_direct_credit: [{value:null, disabled:false}, Validators.required],
            collection_manager_id: [null, Validators.required],
            observation: [null],
 
            // CREDITO INDIRECTO
            indirect_company_id: [null],
            indirect_financial_entity_id: [null],
            indirect_financing_type_id: [null],
            indirect_currency_type_id: [null],
            indirect_awarded_line_amount: [null, [Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineIndirect)]],
            indirect_payment_modality_id: [null],
            indirect_tea_percentage: [null, [Validators.min(this.overdraftPercentageMinValue), Validators.max(this.overdraftPercentageMaxValue)]],
            indirect_observation: [null],
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

    registerDetail(){
        const form = this._formBuilder.group({
            id_Business_Unit: [{value: null, disabled: false}, Validators.required,],
            id_Product: [{value: null, disabled: false}],
            id_court: [{value: null, disabled: false}, Validators.required],
            productsList: [[]]
        });
      this.rates_detail.push(form);
    }
    
    async getAllCourts() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("TCORFAC")
                this.courts = response.data;
        } catch (error) {
                console.log('Error: ', error);
        }
    }

    async getAllCompanies() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
            this.companies = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllModalities() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("22");
            this.modalities = response.data;
            this.modalities.sort((a, b) => a.attribute_length - b.attribute_length);
        } catch (error) {
            console.log("Error: ", error);
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

    async getAllStatusCreditLine() {

      try {
          const response: ResponseData<ParameterModel[]> = await this._getAllStatus.execute("23")
          this.Id_State = response.data
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

    async getClientById(idClient: number) {

        try {
            const response: ResponseData<ClientModel> = await this._getClientById.execute(idClient)

            this.client = response.data
            this.formCreditLine.patchValue(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    async getCreditLineById(idCreditLine: number) {

        try {

            const response: ResponseData<GetCreditLineByIdResponse> = await this._getCreditLineById.execute(idCreditLine)
            this.creditLineResponse = response.data
            response.data.consumption > 0 ? this.hasConsumption = true : this.hasConsumption = false
            this.getClientById(response.data.id_Client)
            this.formCreditLine.get('issue_date_direct_credit').setValue(new Date(response.data.broadcast_date))
            this.stateDetailCode = this.getStatusDetailCodeById(response.data.status_id);

            const operational_lock = response.data.operational_lock; // true or false
            const debt_lock = response.data.ind_credit_line === 1;
            const unlimited_credit = response.data.ind_unlimited_credit === 1;

            let operationalLockControl = this.formCreditLine.get('operationalLock');
            let debtLockControl = this.formCreditLine.get('creditLine');
            let unlimitedCreditControl = this.formCreditLine.get('unlimitedCredit');

            // Establecer valor de bloqueo operativo primero
            operationalLockControl.setValue(operational_lock);
            debtLockControl.setValue(debt_lock);
            unlimitedCreditControl.setValue(unlimited_credit);
            // Configurar línea de crédito según el estado del bloqueo operativo
            if (operational_lock) {
              // Si hay bloqueo operativo (operational_lock = false), deshabilitar línea de crédito
              debtLockControl.disable();
              //this.formCreditLine.get('creditLine').setValue(false);
              unlimitedCreditControl.disable();
              //this.formCreditLine.get('unlimitedCredit').setValue(false);
                operationalLockControl.enable(); // Mantener habilitado el control de bloqueo operativo
            } else {
                // Si no hay bloqueo operativo, configurar normalmente
                debtLockControl.enable();
                unlimitedCreditControl.enable();
            }
            // Luego, establecer la habilitación de bloqueo de deuda y crédito ilimitado
            if (debt_lock) {
                operationalLockControl.disable();
                unlimitedCreditControl.disable();
                debtLockControl.enable();
            }

            if (unlimited_credit) {
                operationalLockControl.disable();
                debtLockControl.disable();
                unlimitedCreditControl.enable();
            }

            response.data.ind_credit_line === 1 ? this.formCreditLine.get('creditLine').setValue(true) : this.formCreditLine.get('creditLine').setValue(false)
            response.data.ind_unlimited_credit === 1 ? this.formCreditLine.get('unlimitedCredit').setValue(true) : this.formCreditLine.get('unlimitedCredit').setValue(false)

            this.formCreditLine.patchValue(response.data)
            this.onChangeModality(response.data.payment_modality_id)
            const modality = this.modalities.find(item => item.id === response.data.payment_modality_id)
            modality?.detail_code === 'CONT'? this.isCounted = true : this.isCounted = false

            this.onChangeCompany(response.data.id_Company)
            this.id_company=response.data.id_Company

            this.isLoading = false;

        }
        catch (error) {
            console.log(error)
        }

    }

    
    // Método específico para cargar productos para un detalle
    async loadProductsForDetail(id_Business_Unit: number, index: number) {
        try {
            if (this.id_company != null && id_Business_Unit != null) {
                let request: GetProductByCompanyBusinessUnitRequest = {
                    Id_Business_Unit: id_Business_Unit,
                    Id_Company: this.id_company
                };

                const response: ResponseData<GetProductByCompanyBusinessUnitResponse[]> =
                    await this._getProductByCompanyBusinessUnitUseCase.execute(request);

                // Obtener el formulario específico
                const specificForm = this.rates_detail.at(index) as FormGroup;

                // Actualizar la lista de productos
                specificForm.get('productsList').setValue(response.data);

                // Verificar que el producto seleccionado esté en la lista
                const selectedProduct = specificForm.get('id_Product').value;
                const productExists = response.data.some(p => p.id_Producto === selectedProduct);

                if (!productExists && selectedProduct) {
                    console.warn('El producto seleccionado no está en la lista de productos para esta unidad');
                }
            }
        } catch (error) {
            console.log('Error loading products for business unit:', error);
        }
    }

    async onChangeCompany(id_Company: number) {
        try {
            this.isDisableAddButton = true
            if (id_Company!=null) {
              const response: ResponseData<GetBusinessUnitByCompanyResponse[]> =
              await this._getUnitByCompany.execute(id_Company);
              this.businessUnits = response.data;

            }

        } catch (error) {
            console.log('Error: ', error);
            this.isDisableAddButton = true
        }
    }
    async onChangeBusinessUnit(id_Business_Unit: number, serviceIndex: number) {
        try {
            if (this.id_company != null && id_Business_Unit != null) {
                const specificForm = this.rates_detail.at(serviceIndex) as FormGroup;
                
                // Resetear el producto seleccionado cuando cambia la unidad
                specificForm.get('id_Product').setValue(null);
                
                let request: GetProductByCompanyBusinessUnitRequest = {
                    Id_Business_Unit: id_Business_Unit,
                    Id_Company: this.id_company
                };

                const response: ResponseData<GetProductByCompanyBusinessUnitResponse[]> =
                    await this._getProductByCompanyBusinessUnitUseCase.execute(request);
                
                // Actualizar la lista de productos en el formulario específico
                specificForm.get('productsList').setValue(response.data);
                
                // Asegurarse de que los cambios se detecten
                specificForm.get('productsList').updateValueAndValidity();
            }
        } catch (error) {
            console.log('Error: ', error);
            this.isDisableAddButton = true;
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

    async updateCreditLine() {

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
            id_CreditLine: this._config.data.id_CreditLine,
            id_Modality: form.payment_modality_id,
            id_Money: form.id_Money,
            amount_Line: form.amount_Line,
            overdraft_Percentage: form.overdraft_Percentage,
            id_Company: form.id_Company,
            broadcast_date: setDateFormat(form.issue_date_direct_credit),
            collection_manager_id: form.collection_manager_id,
            observation: form.observation,
            // CREDITO INDIRECTO
            indirect_company_id: form.indirect_company_id,
            indirect_financial_entity_id: form.indirect_financial_entity_id,
            indirect_financing_type_id: form.indirect_financing_type_id,
            indirect_currency_type_id: form.indirect_currency_type_id,
            indirect_awarded_line_amount: Number(form.indirect_awarded_line_amount) === 0 ? null : Number(form.indirect_awarded_line_amount),
            indirect_payment_modality_id: form.indirect_payment_modality_id,
            indirect_tea_percentage: form.indirect_tea_percentage,
            indirect_observation: form.indirect_observation,
            // DATOS EXTRAS
            ind_credit_line: form.creditLine === true ? 1 : 0, // bloqueo por deuda
            ind_unlimited_credit: form.unlimitedCredit === true ? 1 : 0,
            operational_lock: form.operationalLock, // Nuevo campo
            user: localStorage.getItem('username')
        }
        try {
            const response: any = await this._updateCreditLine.execute(creditLine)
 
            this._alertService.success(response.message)

            this.close()

        }

        catch (error) {
            this._alertService.error(error.Error[0])
        }
    }

    onChangeModality(idModality: number) {

        const modality = this.modalities.find(modality => modality.id === idModality);

        if (modality?.detail_code == CreditLinePaymentMethod.Contado) {
            this.handleContadoModality();
            this.isCounted = true
        }
        else {
            this.handleOtherModality();
            this.isCounted = false
        }

    }

    handleContadoModality() {
        const formAmountLine = this.formCreditLine.get('amount_Line');

        formAmountLine.setValue(null);
        formAmountLine.clearValidators();
        formAmountLine.disable();
    }

    handleOtherModality() {
        const formAmountLine = this.formCreditLine.get('amount_Line');

        formAmountLine.enable();
        formAmountLine.setValidators([Validators.required, Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineDirect)]);
        formAmountLine.updateValueAndValidity();
    }

    validateOnlyNumber(event: any) {
        const charCode = (event.which) ? event.which : event.keycode

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false
        }
        return true
    }

    // Bloqueo por deuda
    changeCreditLine(event) {
        const unlimitedCreditControl = this.formCreditLine.get('unlimitedCredit');
        const operationalLockControl = this.formCreditLine.get('operationalLock');

        // Si el bloqueo por deuda está activado, unlimitedCreditControl(false, deshab) & operationalLockControl(false, deshab)
        if(event.checked === true) {
            unlimitedCreditControl.setValue(false);
            unlimitedCreditControl.disable();
            operationalLockControl.setValue(false);
            operationalLockControl.disable();
        } else {
            // Si el bloqueo por deuda está desactivado, habilitar unlimitedCreditControl y operationalLockControl
            // unlimitedCreditControl.setValue(true);
            unlimitedCreditControl.enable();
            operationalLockControl.enable();
        }
    }

    // Bloqueo operativo
    async changeOperationalLock(event) {
        const debtLockControl = this.formCreditLine.get('creditLine');
        const unlimitedCreditControl = this.formCreditLine.get('unlimitedCredit');

        // Si el bloqueo operativo está activado, unlimitedCreditControl(false, deshab) & debtLockControl(false, deshab)
      if (event.checked) {
          // Verificar si el estado actual es SCL02
          if (this.stateDetailCode === 'SCL02') {
            // Si el estado es SCL02, ejecutar UpdateCreditLineConsumption
            await this.updateCreditLineConsumption();
          }

          // Si el bloqueo operativo está OFF (desactivado)
          // Desactivar el interruptor de línea de crédito
          debtLockControl.disable();

          // Opcionalmente, también puedes forzar el valor a false
          debtLockControl.setValue(false);

          // Como creditLine ahora es false, también desactivamos y reseteamos unlimitedCredit
          unlimitedCreditControl.setValue(false);
          unlimitedCreditControl.disable();
      } else {
          // Si el bloqueo operativo está ON (activado)
          // Habilitar el interruptor de bloqueo de deuda y línea de crédito ilimitado
          debtLockControl.enable();
          unlimitedCreditControl.enable();
      }
    }

    // Bloqueo de credito ilimitado
    changeUnlimitedCredit(event) {
        // Si el crédito ilimitado está activado, operationalLockControl(false, deshab) & debtLockControl(false, deshab) 
        const operationalLockControl = this.formCreditLine.get('operationalLock');
        const debtLockControl = this.formCreditLine.get('creditLine');

        if (event.checked) {
            operationalLockControl.setValue(false);
            operationalLockControl.disable();
            debtLockControl.setValue(false);
            debtLockControl.disable();
        } else {
            operationalLockControl.enable();
            debtLockControl.enable();
        }
    }

  // Método para ejecutar la actualización del consumo de línea de crédito
  async updateCreditLineConsumption() {
    try {

      const form = this.formCreditLine.value
      // Crear el objeto de solicitud
      const request:UpdateCreditLineConsumptionRequest = {
        id_Client:this.creditLineResponse.id_Client,
        id_Company:  form.id_Company
      }
      // Llamar al endpoint
      await this._UpdateCreditLineConsumption.execute(request);

    } catch (error) {
      this._alertService.error(error.message || 'Error al actualizar el consumo de línea de crédito');
    }
  }


    close() {
        this._dialogRef.close()
    }

    getChangesForm() {
        const fieldsToObserve = [
            'indirect_company_id',
            'indirect_financial_entity_id',
            'indirect_financing_type_id',
            'indirect_currency_type_id',
            'indirect_awarded_line_amount',
            'indirect_payment_modality_id',
            'indirect_tea_percentage',
            'indirect_observation'
        ];
      
        fieldsToObserve.forEach(field => {
          this.destroySubscribe = this.formCreditLine.get(field).valueChanges.subscribe(() => {
            this.setIndirectCreditLineRequired(field);
          });
        });
    }

    removeDetail(index: number) {
        if (this.rates_detail.length > 0) {
            this.rates_detail.removeAt(index);
        }
    }

    setIndirectCreditLineRequired(field: string) {
        const form = this.formCreditLine
        const company = form.get('indirect_company_id').value
        const bank = form.get('indirect_financial_entity_id').value
        const financing = form.get('indirect_financing_type_id').value
        const currency = form.get('indirect_currency_type_id').value
        const crediteLine = form.get('indirect_awarded_line_amount').value
        const modality = form.get('indirect_payment_modality_id').value
        const teaPercentage = form.get('indirect_tea_percentage').value
        const observation = form.get('indirect_observation').value
        const input = this.formCreditLine.get([field]).value;
        
        if(input) {
            form.get('indirect_company_id').setValidators(Validators.required)
            form.get('indirect_company_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_financial_entity_id').setValidators(Validators.required)
            form.get('indirect_financial_entity_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_financing_type_id').setValidators(Validators.required)
            form.get('indirect_financing_type_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_currency_type_id').setValidators(Validators.required)
            form.get('indirect_currency_type_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_awarded_line_amount').setValidators([Validators.required, Validators.min(this.amountLineMinValue), Validators.maxLength(this.maxLengthAmountLineIndirect)])
            form.get('indirect_awarded_line_amount').updateValueAndValidity({emitEvent: false})
            form.get('indirect_payment_modality_id').setValidators(Validators.required)
            form.get('indirect_payment_modality_id').updateValueAndValidity({emitEvent: false})
        }

        if(!company && !bank && !financing && !currency && !crediteLine && !modality && !teaPercentage && !observation) {
            form.get('indirect_company_id').clearValidators()
            form.get('indirect_company_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_financial_entity_id').clearValidators()
            form.get('indirect_financial_entity_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_financing_type_id').clearValidators()
            form.get('indirect_financing_type_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_currency_type_id').clearValidators()
            form.get('indirect_currency_type_id').updateValueAndValidity({emitEvent: false})
            form.get('indirect_awarded_line_amount').clearValidators()
            form.get('indirect_awarded_line_amount').updateValueAndValidity({emitEvent: false})
            form.get('indirect_payment_modality_id').clearValidators()
            form.get('indirect_payment_modality_id').updateValueAndValidity({emitEvent: false})
        }
    }

  getStatusDetailCodeById(statusId: number): string | undefined {
    if (!this.Id_State || this.Id_State.length === 0) {
      return undefined;
    }
    const status = this.Id_State.find(state => state.id === statusId);
    return status?.detail_code;
  }
}
