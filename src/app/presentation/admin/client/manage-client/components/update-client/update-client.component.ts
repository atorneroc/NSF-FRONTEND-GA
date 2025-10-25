import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { phoneValidator } from 'src/app/common/validator/phone';
import { ClientModel, ClientSapModel } from 'src/app/core/models/client.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { UpdateClientUsecase } from 'src/app/core/usecase/client/client/update-client.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { GetAdditionalDataUsecase } from '../../../../../../core/usecase/client/client/get-all-additional-data.usecase';
import { AdditionalData } from '../../../../../../core/models/client.model';
import { UpdateClientAdditionalDataUsecase } from 'src/app/core/usecase/client/client/update-client-additional-data.usecase';
import { customValidator, rucValidator, equalLength, minLength, maxLength } from 'src/app/common/validator/validator';
import { invalid, success } from 'src/app/common/helpers/constants/alert.constants';
import { AlertService } from '../../../../../../common/shared/services/alert.service';
import { ValidateInputService } from '../../../../../../common/shared/services/validate-input.service';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { countriesModel } from 'src/app/core/models/countries.model';
import { GetAllCountriessUseCase } from 'src/app/core/usecase/utils/get-all-countries.usecase';
import { StatusSap } from 'src/app/common/helpers/enums/status-sap.enum';
import { RegisterClientSapUsecase } from 'src/app/core/usecase/client/client/register-client-sap.usecase';
import { ClientTypeParameter } from 'src/app/common/helpers/constants/client_type.constants';
import { ClientTypeCodeIntegration } from 'src/app/common/helpers/constants/client_type_code_integration.constants';
import { GetAllCountriesByIdUseCase } from '../../../../../../core/usecase/utils/get-all-countries-by-id.usecase';

@Component({
    selector: 'app-update-client',
    templateUrl: './update-client.component.html',
    styleUrls: ['./update-client.component.scss'],
})

export class UpdateClientComponent implements OnInit {

    public isUniqueCode: boolean = true;
    formClient: FormGroup;
    formFedex: FormGroup;

    statusSap = StatusSap;
    isLoading = true;
    isClientSporadic : boolean = false
    client : ClientModel
    typeClientParam : any

    fiscalAddressClient : string;

    isApproveFedex: boolean;

    // Parametros a consumir
    coins: ParameterModel[] = []
    businessGroups: ParameterModel[] = []
    economicSector: ParameterModel[] = []
    typeDocumentIdenty: ParameterModel[] = []
    segmentation: ParameterModel[] = []
    holding: ParameterModel[] = []
    customerType: ParameterModel[] = []
    countries: countriesModel[] = []

    maxLengthPhone = null;
    additionalData: any[] = [];
    selectedAddtionalData: any[] = [];
    isVisibleAdditionalData = false;
    maxLengthNumberDocument: number
    minLengthNumberDocument: number
    minLengthFedexAccount: number = 9
    maxLengthFedexAccount: number = 9
    minLengthfield: number = 3
    typeDocumentIsRuc: boolean = null;
    previousIntegrationCode: string = null;
    isDisabledTypeClient: boolean = false;
    customerSubType: ParameterModel[] = [];
    attributeLength: number = 0;

    constructor(
        private _formBuilder: FormBuilder,
        private _messageService: AlertService,
        private _config: DynamicDialogConfig,
        private _dialogRef: DynamicDialogRef,
        private _updateClient: UpdateClientUsecase,
        private _registerClientSap: RegisterClientSapUsecase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAdditionalData: GetAdditionalDataUsecase,
        private _getAllCountries: GetAllCountriessUseCase,
        private _getAllCountrieById: GetAllCountriesByIdUseCase,
        private _getClientById: GetClientByIdUsecase,
        private _updateAdditionalData: UpdateClientAdditionalDataUsecase,
        public validateService: ValidateInputService,
    ) {}

        ngOnInit(): void {
        this.initialize();
        }

        private async initialize(): Promise<void> {
        this.createFormClient();

        await this.getAllBusinessGroup();

        this.getAllCoins().then(() => {
            this.selectCurrencyType();
        });

        this.getEconomicSector();
        await this.getAllTypeDocumentIdenty();
        await this.getParentCustomerType();

        this.getAllSegmentation();
        this.getAllHolding();
        // this.getAllCountries();

        await this.getClientById(this._config.data);
        await this.getAllCountrieById(this.client.id_Country);

        this.getListAdditionalData().then(() => {
            this.getAdditionalDataClient(this._config.data);
        });
        }


    createFormClient() {
        this.formClient = this._formBuilder.group({
            id: [null],
            id_Type_Document: [null, Validators.required],
            identity_Card_Number: [null, Validators.required],
            business_Name: [null, [Validators.minLength(this.minLengthfield), Validators.required]],
            commercial_Name: [null],
            currency_Type: [null, Validators.required],
            fedex_Account: [null, [equalLength(this.minLengthFedexAccount), equalLength(this.maxLengthFedexAccount)]],
            authorized_Fedex_Account: [null],
            corporate_Group_Parameter: [null, Validators.required],
            sap_Status_Description: [null],
            migrate_sap_information:[true],
            industry_Code: [null, Validators.required],
            holding_Parameter: [null],
            segmentation_Code: [null, Validators.required],
            comment: [null],
            id_Sap : [null],
            billing_Email: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.required]],
            withholding_Agent: [null],
            id_Country: [null, Validators.required],
            client_Type_Parameter:[null, Validators.required],
            client_SubType_Parameter: [null]
        });
    }

    createFormFedex() {
        this.formFedex = this._formBuilder.group({
            autorizar_fedex: [false],
        });
    }

    async getAllCoins() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("1")
            this.coins = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllBusinessGroup() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("CTGCLIENT")
            this.businessGroups = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getEconomicSector() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("3")
            this.economicSector = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllTypeDocumentIdenty() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("10")
            this.typeDocumentIdenty = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllSegmentation() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("5")
            this.segmentation = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllHolding() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("4")
            this.holding = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getParentCustomerType(){
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("13")
            this.customerType = response.data
        }
        catch (error) {
            console.error(error);
        }
    }
    
    async getParentCustomerSubType() {
        this.customerSubType = null;
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("STCPROV")
            this.customerSubType = response.data
        }
        catch (error) {
            console.error(error);
        }
    }

    async getListAdditionalData(){
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("18")
            this.additionalData = response.data
        } catch (error) {
            console.error(error);
        }
    }

    async updateAdditionalDataClient(body: AdditionalData): Promise<void> {
      try {
          await this._updateAdditionalData.execute(body);
      } catch (error) {
          console.error(error);
      }
    }

    async getAdditionalDataClient(idClient: number) {
        try {
            const response: any = await this._getAdditionalData.execute(idClient)
            const data = response.data.filter(element => element.status === true);
            this.selectedAddtionalData = this.homologateDataClient(data)
        } catch (error) {
            console.error(error);
        }
    }

    async getAllCountries(term: string = '') {
        try {
            const response: ResponseData<countriesModel[]> = await this._getAllCountries.execute(term)
            this.countries = response.data || [];
        }
        catch (error) {
            console.log("Error: ", error)
            this.countries = [];
        }
    }
    async getAllCountrieById(id : number) {
        try {
            const response: ResponseData<countriesModel[]> = await this._getAllCountrieById.execute(id)
            this.countries = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getClientById(idClient: number) {

        try {
            const response: ResponseData<ClientModel> = await this._getClientById.execute(idClient);
            this.client = response.data;

            const clientType = this.customerType.find(value => value.id === response.data.client_Type_Parameter);

            if (clientType && clientType.detail_code === ClientTypeParameter.PROVEEDOR) {
                await this.getParentCustomerSubType();
            } else {
                this.customerSubType = [];
            }

            this.formClient.patchValue(response.data);

            if (!clientType || clientType.detail_code !== ClientTypeParameter.PROVEEDOR) {
                this.formClient.get('client_SubType_Parameter').reset();
            }

            this.validateTypeDocument(response.data.id_Type_Document, response.data.identity_Card_Number);
            this.validateClientType(response.data.client_Type_Parameter);
            this.fiscalAddressClient = response.data.address_Description;
            this.isLoading = false;
            this.previousIntegrationCode = this.customerType.find(value => value.id === response.data.client_Type_Parameter)?.code || null;
        }
        catch (error) {
            console.log(error)
        }
    }

    homologateDataClient(selectedAddtionalData: Array<any>): Array<ParameterModel>{
        return selectedAddtionalData.map(item => {
            const [dataAdditional] = this.additionalData.filter(data => data.id === item.type_Parameter)

            return dataAdditional;
        })
    }

    homologateDataAdditionalRequest(selectedData: any): Array<any>{
        return selectedData.map(element => {
            return {
              type_Parameter: element.id,
              status: true
            }
         })
    }

    selectCurrencyType(){
        const [currencyType] = this.coins.filter(value => value.detail_code === '1')
        this.formClient.get('currency_Type').setValue(currencyType.id)
    }

    applyBusinessRules(value: any, event: any) {
        const valueSelected = value.name
        const listSelected = event.checked
        if(!this.validValueIncludeSelectedList(valueSelected, listSelected)) return;

        this.removeItemsByRule(valueSelected)
    }

    removeItemsByRule(code: string){
        try {
            const rules = {
                'AD001': () => this.removeItemOfList(['AD011', 'AD009', 'AD010']),
                'AD010': () => this.removeItemOfList(['AD001', 'AD009','AD011']),
                'AD011': () => this.removeItemOfList(['AD001', 'AD009', 'AD010']),
                'AD009': () => this.removeItemOfList(['AD001', 'AD010', 'AD011']),
            }
            return rules[code]() || null
        } catch (error) {
            console.log('El codigo recibido no forma parte de las reglas de negocio')
        }
    }

    removeItemOfList(list: Array<string>){

        for (const code of list) {
            const index = this.selectedAddtionalData.findIndex(element => element.name === code)
            if(index >= 0) this.selectedAddtionalData.splice(index, 1)
        }
    }

    validValueIncludeSelectedList(name: string, selectedList: Array<any>): boolean {
        const data = selectedList.filter(element => element.name === name)
        return data.length > 0
    }

    async updateClient() {

        if (this.formClient.invalid) {
            this._messageService.warn(invalid)
            this.formClient.markAllAsTouched()
            return
        }

        const form = this.formClient.getRawValue()
        const [codeIntegrationCustomerType] = this.customerType.filter(value => value.id === this.formClient.get("client_Type_Parameter").value)

        const client: ClientModel = {
            id: form.id,
            business_Name: form.business_Name,
            id_Type_Document: form.id_Type_Document,
            identity_Card_Number: form.identity_Card_Number.toString(),
            commercial_Name: form.commercial_Name,
            fedex_Account: form.fedex_Account,
            authorized_Fedex_Account: form.authorized_Fedex_Account,
            currency_Type: form.currency_Type,
            corporate_Group_Parameter: form.corporate_Group_Parameter,
            industry_Code: form.industry_Code || undefined,
            holding_Parameter: form.holding_Parameter || undefined,
            segmentation_Code: form.segmentation_Code || undefined,
            id_Country: form.id_Country,
            withholding_Agent: form.withholding_Agent,
            billing_Email: form.billing_Email,
            client_Type_Parameter: form.client_Type_Parameter,
            client_SubType_Parameter: form.client_SubType_Parameter,
            user: localStorage.getItem('username'),
            id_Sap: form.id_Sap === null ? this.client.id_Sap : form.id_Sap,
            sap_state_param: (this.formClient.get('sap_Status_Description').value === StatusSap.NOMIGRO && this.formClient.get('migrate_sap_information').value) ? StatusSap.MIGRANDO : undefined,
            client_Type_Integration_Code: codeIntegrationCustomerType.code,
            previous_Integration_Code: this.previousIntegrationCode
        }

        try {
            await this._updateClient.execute(client)

            this._messageService.success(success)

            const migrateSap = this.formClient.get('migrate_sap_information').value
            const clientType = this.formClient.get('client_Type_Parameter').value
            const clienTypePrameter = this.customerType.find(value => value.id === clientType)
            const originalClientTypeParameter = this.customerType.find(value => value.id === this.client.client_Type_Parameter);

            const bodyAdditionalData = {
                id_Client: this._config.data,
                additional_Data: this.homologateDataAdditionalRequest(this.selectedAddtionalData)
            }

            await this.updateAdditionalDataClient(bodyAdditionalData);

            if (this.formClient.get('sap_Status_Description').value === StatusSap.NOMIGRO && this.formClient.get('migrate_sap_information').value || originalClientTypeParameter.detail_code === ClientTypeParameter.ESPORADICO && clienTypePrameter.detail_code !== ClientTypeParameter.ESPORADICO && migrateSap) {
                await this.createClienteSap(client.id)
            }

            this.close();
        }

        catch (error) {
            console.log(error)
        }

    }

    async createClienteSap(idClient: number) {
        const [document] = this.typeDocumentIdenty.filter(value => value.id === this.formClient.get("id_Type_Document").value)
        const [segmentation] = this.segmentation.filter(value => value.id === this.formClient.get("segmentation_Code").value)
        const [economicSector] = this.economicSector.filter(value => value.id === this.formClient.get("industry_Code").value)
        const [customerType] = this.customerType.filter(value => value.id === this.formClient.get("client_Type_Parameter").value)
        const [countries] = this.countries.filter(value => value.id === this.formClient.get("id_Country").value)

        const clientSap: ClientSapModel = {
            idCliente: idClient,
            pais: countries?.sap_Country_Code || "",
            nombre: this.formClient?.get("business_Name").value || "",
            region: countries?.sap_Region_Code || "",
            calle:  this.fiscalAddressClient || "",
            direccion:  this.fiscalAddressClient || "",
            telefono: "00000000" || "",
            ramo: economicSector?.sap_code || "",
            distrito:  this.fiscalAddressClient || "",
            documento: this.formClient?.get("identity_Card_Number").value || "",
            tipoDocumento: document?.sap_code || "",
            grupoTesoreria: segmentation?.sap_code || "",
            condicionPago: "C00" || "",
            tipoCliente: parseInt(customerType.detail_code)
        }

        try {
            const response: any = await this._registerClientSap.execute(clientSap)
            this.close();
        }
        catch (error) {
            console.log(error)
        }
    }

    onPhoneValidator(phone: string) {

        const telephone = this.formClient.get('telephone')

        this.maxLengthPhone = phoneValidator(phone)
        telephone.setValidators([Validators.required, Validators.maxLength(this.maxLengthPhone)])
        telephone.updateValueAndValidity()
    }

    onRucValidator(indentityDocumentNumber: AbstractControl<any>): void {

        const [typeDocument] = this.typeDocumentIdenty.filter(value => value.id === this.formClient.get("id_Type_Document").value)

        const isRucValid = rucValidator(indentityDocumentNumber.value)

        if (this.attributeLength) {
            indentityDocumentNumber.setValidators([
                Validators.required,
                customValidator((!isRucValid && this.typeDocumentIsRuc), { rucValidator: true }),
                equalLength(this.maxLengthNumberDocument),
                equalLength(this.minLengthNumberDocument)
            ])
        } else {
            indentityDocumentNumber.setValidators([
                Validators.required,
                customValidator((!isRucValid && this.typeDocumentIsRuc), { rucValidator: true }),
                minLength(this.minLengthNumberDocument),
                maxLength(this.maxLengthNumberDocument)
            ]);
        }

        indentityDocumentNumber.updateValueAndValidity()

        if (isRucValid && typeDocument.detail_code === "8") {
            if (indentityDocumentNumber.value.startsWith("2")) {

                this.formClient.get('industry_Code').reset()
                this.formClient.get('industry_Code').enable()
            }
            else if (indentityDocumentNumber.value.length === 1) {
                this.getAllBusinessGroup().then(() => {

                    this.formClient.get('industry_Code').reset()
                    this.formClient.get('industry_Code').disable()
                })
            }
        }
    }

    validateClientType(clientTypeId: number): void {
        const clientTypeParameter = this.customerType.find(value => value.id === clientTypeId);
        if (clientTypeParameter && clientTypeParameter.detail_code !== ClientTypeParameter.ESPORADICO) {
            this.customerType = this.customerType.filter(value => value.detail_code !== ClientTypeParameter.ESPORADICO);
             this.isDisabledTypeClient = true;
        }

         if (clientTypeParameter && clientTypeParameter.detail_code === ClientTypeParameter.ESPORADICO) {
            this.customerType = this.customerType.filter(value => value.code !== ClientTypeCodeIntegration.PROVEEDOR);
        }
    }

    async changeClientType(clientTypeParam: number) {
        const clienTypePrameter = this.customerType.find(value => value.id === clientTypeParam);
        const originalClientTypeParameter = this.customerType.find(value => value.id === this.client.client_Type_Parameter);

        if (originalClientTypeParameter.detail_code === ClientTypeParameter.ESPORADICO && clienTypePrameter.detail_code !== ClientTypeParameter.ESPORADICO) {
            this.isClientSporadic = true;
            this.formClient.get('migrate_sap_information').setValue(true);
            this.typeClientParam = clienTypePrameter;
        } else {
            this.isClientSporadic = false;
        }

        if (clienTypePrameter.detail_code === ClientTypeParameter.PROVEEDOR) {
            await this.getParentCustomerSubType();
        } else {
            this.formClient.get('client_SubType_Parameter').reset();
            this.customerSubType = [];
        }
    }

    validateTypeDocument(idTypeDocument: number, documentNumber: string) {

        const documentType = this.typeDocumentIdenty.find(value => value.id === idTypeDocument)

        if (documentType.detail_code == '5' || (documentType.detail_code == '8' && documentNumber.startsWith("2"))){

            this.formClient.get('corporate_Group_Parameter').enable()
            this.businessGroups = this.businessGroups.filter(value => value.detail_code != 'CTGPERNAT')
        }
        else if(idTypeDocument){
            this.getAllBusinessGroup().then(() => {
                const [industryCodeParameter] = this.economicSector.filter(value => value.detail_code === '20')

                this.formClient.get('corporate_Group_Parameter').disable()

                this.formClient.get('industry_Code').setValue(industryCodeParameter.id)
                this.formClient.get('industry_Code').disable()
            })
        }

        const formNumberDocument = this.formClient.get('identity_Card_Number')

        if(!idTypeDocument) {
            formNumberDocument.disable()
            formNumberDocument.reset()

            this.formClient.get('corporate_Group_Parameter').reset()
            this.formClient.get('corporate_Group_Parameter').enable()
            return
        }

        const [document] = this.typeDocumentIdenty.filter(value => value.id === idTypeDocument)
        formNumberDocument.enable()

        if (document.attribute_length) {
            this.minLengthNumberDocument = document.attribute_length;
            this.maxLengthNumberDocument = document.attribute_length;

            formNumberDocument.markAsTouched();
            formNumberDocument.setValidators([Validators.required, equalLength(this.maxLengthNumberDocument), equalLength(this.minLengthNumberDocument)])

        } else {
            this.minLengthNumberDocument = document.min_val || 0;
            this.maxLengthNumberDocument = document.max_val || 0;
            
            formNumberDocument.markAsTouched();
            formNumberDocument.setValidators([
                Validators.required,
                minLength(this.minLengthNumberDocument),
                maxLength(this.maxLengthNumberDocument)
            ]);
        }

        formNumberDocument.updateValueAndValidity()
        
        this.typeDocumentIsRuc = (document.id === 26)
        this.attributeLength = document.attribute_length
    }

    close() {
        this._dialogRef.close()
    }

    approveFedex() {
        this.isApproveFedex = !this.isApproveFedex;
    }

    validate(control: string) {
        if (this.formClient.controls[control].touched) {
            if (this.formClient.controls[control].errors) return 'ng-invalid ng-dirty'
            else return 'border-success'
        }
        else return ''
    }

    toggleAdditionalData() {
        this.isVisibleAdditionalData = !this.isVisibleAdditionalData;
    }

    validateOnlyNumber(event: any) {
        const charCode = (event.which) ? event.which : event.keycode

        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false
        }
        return true
    }

    closeModal() {
        this._dialogRef.close()
    }

    onKeyPress(event: KeyboardEvent) {
        const allowedCharacters = /[a-zA-Z0-9]/;
        if (!allowedCharacters.test(event.key)) {
          event.preventDefault();
        }
    }

    async onCountryFilter(event: any) {
      const searchTerm = event.filter || '';
      await this.getAllCountries(searchTerm);
    }
}
