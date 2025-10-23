import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ClientModel, ClientSapModel } from 'src/app/core/models/client.model';
import { RegisterClientUsecase } from 'src/app/core/usecase/client/client/register-client.usecase';
import { RegisterClientSapUsecase } from 'src/app/core/usecase/client/client/register-client-sap.usecase';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { AdditionalData } from '../../../../../../core/models/client.model';
import { Router } from '@angular/router';
import { invalid, success } from 'src/app/common/helpers/constants/alert.constants';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { RegisterClientAdditionalDataUsecase } from 'src/app/core/usecase/client/client/register-client-additional-data.usecase';
import { customValidator, phoneValidator, rucValidator, equalLength, minLength, maxLength,  } from 'src/app/common/validator/validator';
import { RegisterAddressByClientIdUsecase } from 'src/app/core/usecase/client/address/register-address-by-client-id.usecase';
import { AddressModel } from 'src/app/core/models/address.model';
import { MessageError } from 'src/app/common/validator/error-message';
import { GetAllCountriessUseCase } from 'src/app/core/usecase/utils/get-all-countries.usecase';
import { countriesModel } from 'src/app/core/models/countries.model';
import { GetAllLocationsByUbigeoId } from 'src/app/core/usecase/utils/get-all-locations-by-ubigeo-id.usecase';
import { ubigeoModel } from 'src/app/core/models/ubigeo.model';
import { StatusSap } from 'src/app/common/helpers/enums/status-sap.enum';
import { GetDataClientSunatUseCase } from 'src/app/core/usecase/client/client/get-data-client-sunat.usecase';
import { ClientSunatRequest } from 'src/app/core/models/client/request/client-sunat-request';
import { ClientSunatResponse } from 'src/app/core/models/client/responses/client-sunat-response';
import { TypeDocumentCodeTci } from 'src/app/common/helpers/enums/type-document-code-tci.emun';
import { ClientTypeParameter } from 'src/app/common/helpers/constants/client_type.constants';

@Component({
    selector: 'app-register-client',
    templateUrl: './register-client.component.html',
})

export class RegisterClientComponent implements OnInit {

    formClient: FormGroup;
    formFedex: FormGroup;
    formDirection: FormGroup;

    debounce: any;

    // Parametros a consumir
    coins: ParameterModel[] = []
    businessGroups: ParameterModel[] = []
    economicSector: ParameterModel[] = []
    typeDocumentIdentity: ParameterModel[] = []
    status: ParameterModel[] = [];
    segmentation: ParameterModel[] = []
    holding: ParameterModel[] = []
    additionalData: any[] = [];
    country_Code: any[] = null;
    location: any[] = null;
    customerType: ParameterModel[] = []
    typeAddress: ParameterModel[] = []

    countries: countriesModel[] = []
    lLocations: ubigeoModel[] = []

    maxLengthPhone = null;
    telephone = null
    minLengthNumberDocument: number
    maxLengthNumberDocument: number
    minLengthfield: number = 3
    minLengthFedexAccount: number = 9
    maxLengthFedexAccount: number = 9
    typeDocumentIsRuc: boolean = null;
    attributeLength: number = 0;

    domicile_condition_detail: string = null;
    contributing_state_detail: string = null;
    customerSubType: ParameterModel[] = [];

    constructor(
        public validateService: ValidateInputService,
        private _formBuilder: FormBuilder,
        private _dialogRef: DynamicDialogRef,
        private _registerClient: RegisterClientUsecase,
        private _registerAddressByClientId: RegisterAddressByClientIdUsecase,
        private _config: DynamicDialogConfig,
        private _getParameterById: GetParameterByIdUseCase,
        private _alertService: AlertService,
        private _getAllCountries: GetAllCountriessUseCase,
        private _getAllLocationsByUbigeoId: GetAllLocationsByUbigeoId,
        private _saveAdditionalData: RegisterClientAdditionalDataUsecase,
        private _router: Router,
        private _messageError: MessageError,
        private _registerClientSap: RegisterClientSapUsecase,
        private _getDataClientSunat: GetDataClientSunatUseCase

    ) { }

    ngOnInit() {
        this.createFormClient();
        this.getAllCoins();
        this.getAllBusinessGroup();
        this.getEconomicSector();
        this.getAllTypeDocumentIdenty();
        this.getAllSegmentation();
        this.getAllHolding();
        this.getParentCustomerType();
        this.getParentCustomerTypeSelect();
        this.selectIndustryCodeParam();
        this.getTypeAddress();
        this.getStatus();
        this.getAllCountries();
        this.formClient.get('client_Type_Parameter').valueChanges
        .subscribe(value => this.handleClientTypeChange(value));
    }

    createFormClient() {
        this.formClient = this._formBuilder.group({
            id_Type_Document: [null, Validators.required],
            identity_Card_Number: [{ value: null, disabled: true }, Validators.required,],
            business_Name: [null, [Validators.minLength(this.minLengthfield), Validators.required]],
            telephone: [null],
            commercial_Name: [null],
            currency_type: [null],
            corporate_Group_Parameter: [null, Validators.required],
            industry_Code: [null, Validators.required],
            segmentation_Code: [null, Validators.required],
            authorized_Fedex_Account: [null],
            migrate_sap_information: [true],
            withholding_Agent: [null],
            statusClient: [null],
            countries: [null, Validators.required],
            client_Type_Parameter: [null],
            client_SubType_Parameter: [null],
            ubigeo_id: [null, Validators.required],
            id_sap: [null],
            fedex_Account: [null, [equalLength(this.minLengthFedexAccount), equalLength(this.maxLengthFedexAccount)]],
            fiscalAddress: [null, [Validators.minLength(this.minLengthfield), Validators.required]],
            billing_Email: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.required]],

        })
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
            this.typeDocumentIdentity = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllSegmentation() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("5")
            this.segmentation = response.data.reverse()
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getTypeAddress() {

        try {
            const data: ResponseData<ParameterModel[]> = await this._getParameterById.execute("9")
            this.typeAddress = data.data
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

    async getParentCustomerTypeSelect() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("13")
            this.customerType = response.data
        }
        catch (error) {
            console.error(error);
        }
    }

    async getParentCustomerType() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("13")
            this.additionalData = response.data
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

    async getStatus() {
        try {

            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("ESTCONT")
            this.status = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    // Cambiar el método en el componente
    async getAllCountries(term: string = '') {
        try {
            const response: ResponseData<countriesModel[]> = await this._getAllCountries.execute(term);
            this.countries = response.data || [];
        } catch (error) {
            console.log("Error: ", error);
            this.countries = [];
        }
    }

    async getAllLocationsByUbigeoId(ubigeoId: string) {

        try {
            const response: ResponseData<ubigeoModel[]> = await this._getAllLocationsByUbigeoId.execute(ubigeoId);
            this.lLocations = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async onChangeCountry(idCountry: number) {
        const selectedCountry = this.countries.find((country) => country.id === idCountry);
        this.lLocations = null;

        if (selectedCountry.ubigeo_Code) {
            await this.getAllLocationsByUbigeoId(selectedCountry.ubigeo_Code);
        }

        if (selectedCountry.sap_Country_Code == 'PE') {
            this.formClient.get('ubigeo_id').setValidators(Validators.required);
            this.formClient.get('ubigeo_id').updateValueAndValidity();
        } else {
            this.formClient.get('ubigeo_id').clearValidators();
            this.formClient.get('ubigeo_id').updateValueAndValidity();
        }
    }

    // Método para manejar el cambio de tipo de cliente
    async handleClientTypeChange(idCustomerType: number) {
        if (!idCustomerType) {
            this.customerSubType = [];
            this.formClient.get('client_SubType_Parameter').reset();
            return;
        }

        const selectedClientType = this.customerType.find((customerType) => customerType.id === idCustomerType);

        this.formClient.get('client_SubType_Parameter').reset();

        if (selectedClientType && selectedClientType.detail_code === ClientTypeParameter.PROVEEDOR) {
            await this.getParentCustomerSubType();
        } else {
            this.customerSubType = [];
        }
    }

    async saveAdditionalData(body: AdditionalData): Promise<void> {
        try {
            await this._saveAdditionalData.execute(body)
        }
        catch (error) {
        }
    }

    async registerClient() {

        if (this.formClient.invalid) {
            this._alertService.warn(invalid)
            this.formClient.markAllAsTouched()
            return
        }

        const form = this.formClient.getRawValue()

         const [codeIntegrationCustomerType] = this.customerType.filter(value => value.id === this.formClient.get("client_Type_Parameter").value)

        const client: ClientModel = {
            id_Type_Document: form.id_Type_Document,
            industry_Code: form.industry_Code,
            segmentation_Code: form.segmentation_Code?.id,
            corporate_Group_Parameter: form.corporate_Group_Parameter,
            identity_Card_Number: form.identity_Card_Number.toString(),
            commercial_Name: form.commercial_Name,
            business_Name: form.business_Name,
            client_Type_Parameter: form.client_Type_Parameter,
            client_SubType_Parameter: form.client_SubType_Parameter,
            billing_Email: form.billing_Email,
            fedex_Account: form.fedex_Account,
            withholding_Agent: form.withholding_Agent,
            authorized_Fedex_Account: form.authorized_Fedex_Account,
            id_Country: form.countries,
            user: localStorage.getItem('username'),
            id_Sap: form.id_sap || "",
            sap_state_param: StatusSap.MIGRANDO,
            client_Type_Integration_Code: codeIntegrationCustomerType.code,
            domicile_condition_detail: this.domicile_condition_detail || null,
            contributing_state_detail: this.contributing_state_detail || null
        }

        try {
            const response: any = await this._registerClient.execute(client)

            this._alertService.success(success)

            await this.createDirection(response.data)
            await this.createClienteSap(response.data)

            this.close()
            this.getClientById(response.data)
        }


        catch (error) {
            //this._alertService.error(error.error.Error[0])
        }
    }

    async createDirection(idClient: number) {

        const [typeStatus] = this.status.filter(element => element.name === "Activo")
        const [adressId] = this.typeAddress.filter(value => value.detail_code === '1')

        const address: AddressModel = {
            id_Client: idClient,
            parameter_Type: adressId.id,
            address: this.formClient.get("fiscalAddress").value,
            id_Ubigeo: this.formClient.get("ubigeo_id").value || undefined,
            status: typeStatus?.id,
            id_Unit: 0,
            user: localStorage.getItem('username'),
        }

        try {
            const response: any = await this._registerAddressByClientId.execute(address)

        }
        catch (error) {
            console.log(error)
        }
    }

    async createClienteSap(idClient: number) {

        const [document] = this.typeDocumentIdentity.filter(value => value.id === this.formClient.get("id_Type_Document").value)
        const [segmentation] = this.segmentation.filter(value => value.id === this.formClient.get("segmentation_Code").value.id)
        const [economicSector] = this.economicSector.filter(value => value.id === this.formClient.get("industry_Code").value)
        const [customerType] = this.customerType.filter(value => value.id === this.formClient.get("client_Type_Parameter").value)
        const [countries] = this.countries.filter(value => value.id === this.formClient.get("countries").value)

        const clientSap: ClientSapModel = {
            idCliente: idClient,
            pais: countries?.sap_Country_Code || "",
            nombre: this.formClient?.get("business_Name")?.value || "",
            region: countries?.sap_Region_Code || "",
            calle: this.formClient?.get("fiscalAddress")?.value || "",
            direccion: this.formClient?.get("fiscalAddress")?.value || "",
            telefono: "00000000",                          // limpiado
            ramo: economicSector?.sap_code || "",
            distrito: this.formClient?.get("fiscalAddress")?.value || "",
            documento: this.formClient?.get("identity_Card_Number")?.value || "",
            tipoDocumento: document?.sap_code || "",
            grupoTesoreria: segmentation?.sap_code || "",
            condicionPago: "C00",                          // limpiado
            tipoCliente: parseInt(customerType.detail_code)
        }


        try {
            const response: any = await this._registerClientSap.execute(clientSap)

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

    onRucValidator(identityDocumentNumber: AbstractControl<any>): void {
        const [typeDocument] = this.typeDocumentIdentity.filter(value => value.id === this.formClient.get("id_Type_Document").value)

        if (!identityDocumentNumber.value) {
            return
        }

        const isRucValid = rucValidator(identityDocumentNumber.value)

        if (this.attributeLength) {
            identityDocumentNumber.setValidators([
                Validators.required,
                customValidator((!isRucValid && this.typeDocumentIsRuc), { rucValidator: true }),
                equalLength(this.maxLengthNumberDocument),
                equalLength(this.minLengthNumberDocument)
            ])
        } else {
            identityDocumentNumber.setValidators([
                Validators.required,
                customValidator((!isRucValid && this.typeDocumentIsRuc), { rucValidator: true }),
                minLength(this.minLengthNumberDocument),
                maxLength(this.maxLengthNumberDocument)
            ]);
        }

        identityDocumentNumber.updateValueAndValidity()

        if (isRucValid && typeDocument.detail_code === "8") {
            if (identityDocumentNumber.value.startsWith("2")) {

                this.formClient.get('corporate_Group_Parameter').reset()
                this.formClient.get('corporate_Group_Parameter').enable()

                this.formClient.get('business_Name').setValidators(Validators.required)
                this.formClient.get('business_Name').updateValueAndValidity()

                this.formClient.get('industry_Code').reset()
                this.formClient.get('industry_Code').enable()

                this.businessGroups = this.businessGroups.filter(value => value.detail_code !== "CTGPERNAT")

                const [clientTypeParameter] = this.customerType.filter(value => value.detail_code === '1')

                this.formClient.get('client_Type_Parameter').setValue(clientTypeParameter.id)
                this.formClient.get('client_SubType_Parameter').reset();
            }

            else if (identityDocumentNumber.value.length === 1) {

                this.getAllBusinessGroup().then(() => {
                    const [industryCodeParameter] = this.economicSector.filter(value => value.detail_code === '20')
                    const [idPersonaNatural] = this.businessGroups.filter(value => value.detail_code == 'CTGPERNAT')

                    this.formClient.get('corporate_Group_Parameter').setValue(idPersonaNatural.id)
                    this.formClient.get('corporate_Group_Parameter').disable()

                    this.formClient.get('industry_Code').setValue(industryCodeParameter.id)
                    this.formClient.get('industry_Code').disable()

                    this.formClient.get('client_Type_Parameter').setValue(49)
                    this.formClient.get('client_SubType_Parameter').reset();

                    const [clientTypeParameter] = this.customerType.filter(value => value.detail_code === '3')

                    this.formClient.get('client_Type_Parameter').setValue(clientTypeParameter.id)
                    this.formClient.get('client_SubType_Parameter').reset();
                })
            }
        }
    }

    showInputSap() {

        return this.formClient.value.migrateSap;
    }

    close() {
        this._dialogRef.close()
    }

    async changeTypeDocument(idTypeDocument: number) {
        const formNumberDocument = this.formClient.get('identity_Card_Number');
        const [document] = this.typeDocumentIdentity.filter(value => value.id === idTypeDocument)

        if (!idTypeDocument) {
            formNumberDocument.disable();
            formNumberDocument.reset();
            this.formClient.get('client_Type_Parameter').reset();
            this.formClient.get('corporate_Group_Parameter').reset();
            this.formClient.get('corporate_Group_Parameter').enable();
            return;
        }

        // Habilitar el campo primero
        formNumberDocument.enable();
        formNumberDocument.setValue(null);

        if (formNumberDocument && formNumberDocument.value && document?.tci_code && (document.tci_code === TypeDocumentCodeTci.DNI || document.tci_code === TypeDocumentCodeTci.RUC)) {
            const response = await this.getDataClient(formNumberDocument.value, document.tci_code);
            const infoClientSunat  = response?.data

            if (infoClientSunat) {
                this.formClient.get('business_Name').setValue(infoClientSunat.razon_social)
                this.formClient.get('commercial_Name').setValue(infoClientSunat.razon_comercial)
                this.formClient.get('fiscalAddress').setValue(infoClientSunat.direccion_fiscal)

                if (infoClientSunat.agente_retencion === 'SI') {
                    this.formClient.get('withholding_Agent').setValue(true);
                } else {
                    this.formClient.get('withholding_Agent').setValue(false);
                }

                this.domicile_condition_detail = infoClientSunat.condicion_domicilio || null;
                this.contributing_state_detail = infoClientSunat.agente_retencion || null;

                if (infoClientSunat.ubigeo && infoClientSunat.ubigeo.trim() !== '') {
                    const ubigeoPrefix = infoClientSunat.ubigeo.substring(0, 2);
                    const selectedCountry = this.countries.find((country) => country.ubigeo_Code === ubigeoPrefix);

                    if (selectedCountry) {
                        const countryId = selectedCountry.id;
                        this.formClient.get('countries').setValue(countryId);

                        await this.onChangeCountry(countryId);

                        if (this.lLocations && this.lLocations.length > 0) {
                            const selectedUbigeo = this.lLocations.find((ubigeo) => ubigeo.ubigeo_Code === infoClientSunat.ubigeo);
                            if (selectedUbigeo) {
                                this.formClient.get('ubigeo_id').setValue(selectedUbigeo.id);
                            }
                        }
                    }
                }
            }

            else{
                this.formClient.get('business_Name').reset();
                this.formClient.get('commercial_Name').reset();
                this.formClient.get('fiscalAddress').reset();
                this.formClient.get('withholding_Agent').setValue(false);
                this.formClient.get('countries').reset();
                this.formClient.get('ubigeo_id').reset();
                this.domicile_condition_detail = null;
                this.contributing_state_detail = null;
            }
        }

        if (document.detail_code == '5' || document.detail_code == '8' || document.detail_code == '12') {

            this.formClient.get('corporate_Group_Parameter').reset()
            this.formClient.get('corporate_Group_Parameter').enable()
            this.formClient.get('business_Name').setValidators(Validators.required)
            this.formClient.get('business_Name').updateValueAndValidity()
            this.formClient.get('industry_Code').reset()
            this.formClient.get('industry_Code').enable()

            this.businessGroups = this.businessGroups.filter(value => value.detail_code != 'CTGPERNAT')
            const [clientTypeParameter] = this.customerType.filter(value => value.detail_code === '1')

            this.formClient.get('client_Type_Parameter').setValue(clientTypeParameter.id)
            this.formClient.get('client_SubType_Parameter').reset();
        }
        else if (document.detail_code) {

            this.getAllBusinessGroup().then(() => {

                const [clientTypeParameter] = this.customerType.filter(value => value.detail_code === '3')
                const [corporateGroupParameter] = this.businessGroups.filter(value => value.detail_code === 'CTGPERNAT')
                const [industryCodeParameter] = this.economicSector.filter(value => value.detail_code === '20')

                this.formClient.get('corporate_Group_Parameter').setValue(corporateGroupParameter.id)
                this.formClient.get('corporate_Group_Parameter').disable()
                this.formClient.get('industry_Code').setValue(industryCodeParameter.id)
                this.formClient.get('industry_Code').disable()
                this.formClient.get('client_Type_Parameter').setValue(clientTypeParameter.id)
                this.formClient.get('client_SubType_Parameter').reset();
            })
        }

        //const formNumberDocument = this.formClient.get('identity_Card_Number')

        // if (!idTypeDocument) {
        //     formNumberDocument.disable()
        //     formNumberDocument.reset()
        //     this.formClient.get('client_Type_Parameter').reset()
        //     this.formClient.get('corporate_Group_Parameter').reset()
        //     this.formClient.get('corporate_Group_Parameter').enable()
        //     return
        // }

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

        formNumberDocument.updateValueAndValidity();
        formNumberDocument.markAsTouched();
        formNumberDocument.markAsDirty();

        // Forzar un estado inválido
        setTimeout(() => {
            formNumberDocument.setErrors({ 'required': true });
            formNumberDocument.updateValueAndValidity();
        }, 0);


        this.typeDocumentIsRuc = (document.detail_code === '8')
        this.attributeLength = document.attribute_length
        this.onRucValidator(formNumberDocument)
    }

    selectIndustryCodeParam() {
        clearTimeout(this.debounce)

        this.debounce = setTimeout(() => {
            const [industryCode] = this.economicSector.filter(value => value.detail_code === '20')
            this.formClient.get('industry_Code').setValue(industryCode.id)
        }, 500)
    }

    getClientById(idClient: number) {
        this._router.navigate(['/admin/client/' + idClient])
    }

    closeModal() {
        this._dialogRef.close()
    }

    validateOnlyNumber(event: any) {
        const idTypeDocument = this.formClient.get('id_Type_Document').value;
        const typeDocument = this.typeDocumentIdentity.find(doc => doc.id === idTypeDocument);

        // Verificar si es uno de los tipos de documento que permiten alfanuméricos
        const allowAlphanumeric = typeDocument && ['1', '5', '6', '11', '12'].includes(typeDocument.detail_code);

        if (allowAlphanumeric) {
            const charCode = event.charCode || event.keyCode;
            return (
                (charCode >= 48 && charCode <= 57) || // Números
                (charCode >= 65 && charCode <= 90) || // Letras mayúsculas
                (charCode >= 97 && charCode <= 122)   // Letras minúsculas
            );
        } else {
            const charCode = (event.which) ? event.which : event.keycode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        }
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
    async getDataClient(doc_number: string, type_document_sunat: string): Promise<ResponseData<ClientSunatResponse> | null> {
        const request: ClientSunatRequest = {
            docNumber: doc_number,
            typeDocumentSunat: type_document_sunat
        };

        try {
            const response: ResponseData<ClientSunatResponse> = await this._getDataClientSunat.execute(request);

            const processedResponse: ResponseData<ClientSunatResponse> = {
                message: response.message || "",
                data: response.data || null,
                error: response.message ? [response.message] : []
            };

            return processedResponse;

        } catch (error) {
            console.error('Ocurrió un error al asignar la información del cliente:', error);
            return null;
        }
    }

    async keyEnterIdentityCardNumber(event) {
        const formNumberDocument = this.formClient.get('identity_Card_Number');
        const idTypeDocument = this.formClient.get('id_Type_Document');
        const [document] = this.typeDocumentIdentity.filter(value => value.id === idTypeDocument.value);

        if (!formNumberDocument || !formNumberDocument.value || !document?.tci_code) {
            this.formClient.get('business_Name').reset();
            this.formClient.get('commercial_Name').reset();
            this.formClient.get('fiscalAddress').reset();
            this.formClient.get('withholding_Agent').setValue(false);
            this.formClient.get('countries').reset();
            this.formClient.get('ubigeo_id').reset();
            this.domicile_condition_detail = null;
            this.contributing_state_detail = null;
            return;
        }

        // Si los valores son válidos, continuar con la lógica
        if (document.tci_code === TypeDocumentCodeTci.DNI || document.tci_code === TypeDocumentCodeTci.RUC) {
            const response = await this.getDataClient(formNumberDocument.value, document.tci_code);
            const infoClientSunat = response?.data;

            if (infoClientSunat) {
                this.formClient.get('business_Name').setValue(infoClientSunat.razon_social);
                this.formClient.get('commercial_Name').setValue(infoClientSunat.razon_comercial);
                this.formClient.get('fiscalAddress').setValue(infoClientSunat.direccion_fiscal);

                if (infoClientSunat.agente_retencion === 'SI') {
                    this.formClient.get('withholding_Agent').setValue(true);
                } else {
                    this.formClient.get('withholding_Agent').setValue(false);
                }

                this.domicile_condition_detail = infoClientSunat.condicion_domicilio || null;
                this.contributing_state_detail = infoClientSunat.estado_contribuyente || null;

                if (infoClientSunat.ubigeo && infoClientSunat.ubigeo.trim() !== '') {
                    const ubigeoPrefix = infoClientSunat.ubigeo.substring(0, 2);
                    const selectedCountry = this.countries.find((country) => country.ubigeo_Code === ubigeoPrefix);

                    if (selectedCountry) {
                        const countryId = selectedCountry.id;
                        this.formClient.get('countries').setValue(countryId);

                        await this.onChangeCountry(countryId);

                        if (this.lLocations && this.lLocations.length > 0) {
                            const selectedUbigeo = this.lLocations.find((ubigeo) => ubigeo.ubigeo_Code === infoClientSunat.ubigeo);
                            if (selectedUbigeo) {
                                this.formClient.get('ubigeo_id').setValue(selectedUbigeo.id);
                            }
                        }
                    }
                }

            } else {
                this.formClient.get('business_Name').reset();
                this.formClient.get('commercial_Name').reset();
                this.formClient.get('fiscalAddress').reset();
                this.formClient.get('withholding_Agent').setValue(false);
                this.formClient.get('countries').reset();
                this.formClient.get('ubigeo_id').reset();
                this.domicile_condition_detail = null;
                this.contributing_state_detail = null;
            }
        }
    }
}
