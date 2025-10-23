import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddressType } from 'src/app/common/helpers/constants/address_type.constants';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { MessageError } from 'src/app/common/validator/error-message';
import { AddressModel } from 'src/app/core/models/address.model';
import { ClientModel } from 'src/app/core/models/client.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ubigeoModel } from 'src/app/core/models/ubigeo.model';
import { RegisterAddressByClientIdUsecase } from 'src/app/core/usecase/client/address/register-address-by-client-id.usecase';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';
import { GetAllLocationsByUbigeoId } from 'src/app/core/usecase/utils/get-all-locations-by-ubigeo-id.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';

@Component({
    selector: 'app-register-address-component',
    templateUrl: './register-address.component.html',
})

export class RegisterAddressComponent implements OnInit {

    formDirection: FormGroup;
    maxLengthAddress = 150
    minLengthAddress = 3
    typeAddress: ParameterModel[] = [];
    status :ParameterModel[] = [];
    unit: ParameterModel[] = [];
    lLocations: ubigeoModel[] = [];
    client: ClientModel;
    maxLengthfield: number = 20

    idClient: number

    isTypeFiscalAddress: boolean = null;
    clienId = this._config.data.data

    constructor(
        private _formBuilder: FormBuilder,
        private _messageService: MessageService,
        public validateService: ValidateInputService,
        private _dialogRef: DynamicDialogRef,
        private _registerAddressByClientId: RegisterAddressByClientIdUsecase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getClientById: GetClientByIdUsecase,
        private _getAllLocationsByUbigeoId: GetAllLocationsByUbigeoId,
        private _config: DynamicDialogConfig,
        private _messageError: MessageError,
    ) {}

    ngOnInit() {
        this.createFormDirection();
        this.getTypeAddress();
        this.getUnits();
        this.getStatus();
        this.getClientById(this.clienId);
    }

    createFormDirection() {
        this.formDirection = this._formBuilder.group({
            typeAddress: [null, Validators.required],
            unit: [null, Validators.required],
            direction: [null, [Validators.required, Validators.maxLength(this.maxLengthAddress), Validators.minLength(this.minLengthAddress)]],
            postal_Code: [null, Validators.maxLength(this.maxLengthfield)],
            ubigeo_id: [null, Validators.required],
            status: [null],
            ubigeo: [null],
        });
    }

    async getClientById(clienId: number) {

        try {
            const response: ResponseData<ClientModel> = await this._getClientById.execute(clienId)
            this.client = response.data
            this.getAllLocationsByUbigeoId(response.data.code_Country.toString());
        }
        catch (error) {
            console.log(error)
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

    async getUnits() {

        try {

            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("8")
            this.unit = response.data
        }
        catch (error) {
            console.log("Error: ", error)
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

    async getAllLocationsByUbigeoId(ubigeoId: string) {

        try {
            const response: ResponseData<ubigeoModel[]> = await this._getAllLocationsByUbigeoId.execute(ubigeoId);
            this.lLocations = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    validateTypeCountry() {

        if (this.client.description_Country.includes('PERU') && this.formDirection.get("typeAddress").value.detail_code === AddressType.FISCAL) {
            this.formDirection.get('ubigeo_id').setValidators(Validators.required)
            this.formDirection.get('ubigeo_id').updateValueAndValidity()
        } else {
            this.formDirection.get('ubigeo_id').clearValidators()
            this.formDirection.get('ubigeo_id').updateValueAndValidity()
        }
    }

    getTypeAddressInput(input){
        if(!input) { this.isTypeFiscalAddress = null; this.formDirection.reset(); return;}
        this.isTypeFiscalAddress = (input.detail_code === AddressType.FISCAL)
        this.setValidatonRequired(this.isTypeFiscalAddress)
        this.validateTypeCountry()

    }

    setValidatonRequired(isFiscal: boolean): void {
        const keysFormOperative = ['unit']

        this.formDirection.get('unit').reset()
        this.formDirection.get('direction').reset()

        if(isFiscal){
            this.removeValidatorForm(keysFormOperative)

        } else {
            this.setRequiredForm(keysFormOperative)

        }
    }

    setRequiredForm(keys: Array<any>): void{
        for (const name of keys) {
            this.formDirection.controls[name].setValidators([Validators.required])
            this.formDirection.get('postal_Code').updateValueAndValidity()
        }
    }

    removeValidatorForm(keys: Array<any>): void{
        for (const name of keys) {
            this.formDirection.get(name).setValidators([])
            this.formDirection.get(name).updateValueAndValidity()
        }
    }

    getPostalCodeAndUbigeoByUbication(value: number): void {
        if(!value) return this.formDirection.controls['ubigeo'].setValue(null)
        const  address  = this.lLocations.find(element => element.id === value)
        this.formDirection.controls['ubigeo'].setValue(address.ubigeo_Code)
        this.formDirection.controls['postal_Code'].setValue(address.postal_Code)
    }

    

    async createDirection() {
        const form = this.formDirection.value

        const [ typeAddress ] = this.typeAddress.filter(element => element.id === form.typeAddress.id)
        const [ typeStatus ] = this.status.filter(element => element.name === "Activo")

        const isInvalidForm = this._messageError.show(this.formDirection, this.formDirection.invalid, 'invalid');
        const existFiscalAddress = this._messageError.show(this.formDirection, typeAddress.detail_code == AddressType.FISCAL && this._config.data.existFiscalAddress, 'exist-fiscal-address');

        if(isInvalidForm || existFiscalAddress) return;

        const address: AddressModel = {
            id_Client: this._config.data.data,
            id_Ubigeo: form.ubigeo_id || undefined,
            id_Unit: form.unit?.id || undefined,
            status: typeStatus?.id ,
            parameter_Type: form.typeAddress?.id,
            address: form.direction,
            postal_Code: form.postal_Code || undefined,
            user: localStorage.getItem('username'),
        }

        try {
            const response: any = await this._registerAddressByClientId.execute(address)

            this._messageService.add({
                severity: 'success',
                summary: 'Registrado!',
                detail: response.message || 'Registrado correctamente',
              });

            this.close();
        }
        catch (error) {
            console.log(error)
        }
    }

    close() {
        this._dialogRef.close()
    }

}
