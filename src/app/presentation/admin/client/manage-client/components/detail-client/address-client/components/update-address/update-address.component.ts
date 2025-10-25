import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressModel } from 'src/app/core/models/address.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateAddressByIdUsecase } from 'src/app/core/usecase/client/address/update-address-by-id.usecase';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { GetAddressByIdUsecase } from 'src/app/core/usecase/client/address/get-address-by-id.usecase';
import { MessageError } from 'src/app/common/validator/error-message';
import { MessageService } from 'primeng/api';
import { AddressType } from 'src/app/common/helpers/constants/address_type.constants';
import { ubigeoModel } from 'src/app/core/models/ubigeo.model';
import { GetAllLocationsByUbigeoId } from 'src/app/core/usecase/utils/get-all-locations-by-ubigeo-id.usecase';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { ClientModel } from 'src/app/core/models/client.model';
import { GetClientByIdUsecase } from 'src/app/core/usecase/client/client/get-client-by-id.usecase';


@Component({
    selector: 'app-update-address-component',
    templateUrl: './update-address.component.html'
})

export class UpdateAddressComponent implements OnInit {

    address: AddressModel
    formDirection: FormGroup;
    client: ClientModel

    clienId = this._config.data.idClient

    lTypeDirection: ParameterModel[] = [];
    unit: ParameterModel[] = [];
    province: ParameterModel[] = [];
    district: ParameterModel[] = [];
    country: ParameterModel[] = [];
    lLocations: ubigeoModel[] = [];
    status: any[] = [];
    location: any[] = null;
    maxLengthfield: number = 20;
    maxLengthAddress = 150;
    minLengthAddress = 3;

    // Tipo de dirección previa
    previousAddressType: string = null;

    isTypeFiscalAddress: boolean = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _updateAddressById: UpdateAddressByIdUsecase,
        private _config: DynamicDialogConfig,
        public validateService: ValidateInputService,
        private _dialogRef: DynamicDialogRef,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllLocationsByUbigeoId: GetAllLocationsByUbigeoId,
        private _getAddressById: GetAddressByIdUsecase,
        private _getClientById: GetClientByIdUsecase,
        private _messageError: MessageError,
        private _messageService: MessageService,
    ) {
        this.status = [
            {
                id: 442,
                description: 'Activo'
            },
            {
                id: 441,
                description: 'Inactivo'
            }
        ]
    }

    // async ngOnInit() {
    //     this.createFormDirection();
    //     await this.getAllTypeDirections();
    //     await this.getClientById(this.clienId);
    //     this.getUnits();
    //     this.getAddressById();
    // }

    ngOnInit(): void {
        this.initialize();
        }

    private async initialize(): Promise<void> {
    this.createFormDirection();
    await this.getAllTypeDirections();
    await this.getClientById(this.clienId);
    this.getUnits();
    this.getAddressById();
    }


    createFormDirection() {
        this.formDirection = this._formBuilder.group({
            postal_Code: [null, Validators.maxLength(this.maxLengthfield)],
            id_Ubigeo: [null, Validators.required],
            parameter_Type: [null, Validators.required],
            id_Unit: [null, Validators.required],
            address: [null,  [Validators.required, Validators.maxLength(this.maxLengthAddress), Validators.minLength(this.minLengthAddress)]],
            status: [null],
            ubigeo: [null]
        });
    }

    async getAllTypeDirections() {

        try {
            const data: ResponseData<ParameterModel[]> = await this._getParameterById.execute("9")
            this.lTypeDirection = data.data
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

    async getAllLocationsByUbigeoId(ubigeoId: string) {

        try {
            const response: ResponseData<ubigeoModel[]> = await this._getAllLocationsByUbigeoId.execute(ubigeoId);
            this.lLocations = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getClientById(clienId: number) {

        try {
            const response: ResponseData<ClientModel> = await this._getClientById.execute(clienId)
            this.client = response.data
        }
        catch (error) {
            console.log(error)
        }
    }

    validateTypeCountry() {
        const typeAddress = this.lTypeDirection.find(item => item.id === this.formDirection.get("parameter_Type").value)
        if (this.client.description_Country.includes('PERU') && typeAddress.detail_code === AddressType.FISCAL) {
            this.formDirection.get('id_Ubigeo').setValidators(Validators.required)
            this.formDirection.get('id_Ubigeo').updateValueAndValidity()
        } else {
            this.formDirection.get('id_Ubigeo').clearValidators()
            this.formDirection.get('id_Ubigeo').updateValueAndValidity()
        }
    }

    async getAddressById() {
        try {
            const addressId = this._config.data.data;
            const response: any = await this._getAddressById.execute(addressId)

            this.formDirection.get("parameter_Type").setValue(Number(response.data.parameter_Type))
            this.isTypeFiscalAddress = (response.data.detail_Code === AddressType.FISCAL)
            this.previousAddressType = response.data.detail_Code
            this.validateTypeParam(response.data.detail_Code)
            this.getTypeAddressInput(this.previousAddressType, false)

            this.formDirection.get("postal_Code").setValue(response.data.postal_Code)
            this.getAllLocationsByUbigeoId(response.data.code_Country);
            this.formDirection.get("id_Ubigeo").setValue(response.data.id_Ubigeo)
            this.formDirection.get("ubigeo").setValue(response.data.code_Ubigeo)
            this.formDirection.get("address").setValue(response.data.address)
            this.formDirection.get("status").setValue(response.data.status)
            this.formDirection.get("id_Unit").setValue(response.data.id_Unit)
            this.validateTypeCountry()
        } catch (error) {
            console.log('Ocurrió un error al obtener la dirección por ID', error)
        }
    }

    getTypeAddressInput(id, first: boolean = true){
        if(id === null) {
            this.isTypeFiscalAddress = null;
            this.formDirection.reset();
            return;
        }
        this.isTypeFiscalAddress = (id === AddressType.FISCAL)
        // this.setValidatonRequired(this.isTypeFiscalAddress, first)

    }

    setValidatonRequired(isFiscal: boolean, first: boolean = true): void {
        const keysFormFiscal = ['id_Ubigeo', 'postal_Code']
        const keysFormOperative = ['id_Unit']

        if(first){
            this.formDirection.get('id_Unit').reset()
            this.formDirection.get('postal_Code').reset()
            this.formDirection.get('id_Ubigeo').reset()
            this.formDirection.get('address').reset()
            this.formDirection.get('ubigeo').reset()
        }

        if(isFiscal){
            this.removeValidatorForm(keysFormOperative)
            this.setRequiredForm(keysFormFiscal)

        } else {
            this.removeValidatorForm(keysFormFiscal)
            this.setRequiredForm(keysFormOperative)

        }
    }

    setRequiredForm(keys: Array<any>): void{
        for (const name of keys) {
            this.formDirection.controls[name].setValidators([Validators.required])
            this.formDirection.get(name).updateValueAndValidity()
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

    async updateDirection() {

        const isPristine = this._messageError.show(this.formDirection, this.formDirection.pristine, 'pristine');

        if (isPristine) return;

        const form = this.formDirection.getRawValue();

        const [ typeAddress ] = this.lTypeDirection.filter(element => element.id === form.parameter_Type)

        const condition =  typeAddress.detail_code === AddressType.FISCAL && this._config.data.existFiscalAddress;
        const isInvalidForm = this._messageError.show(this.formDirection, this.formDirection.invalid, 'invalid')

        if (isInvalidForm) return;

        const address: AddressModel = {
            id: this._config.data.data,
            postal_Code: form.postal_Code || undefined,
            id_Ubigeo: form.id_Ubigeo || undefined,
            parameter_Type: form.parameter_Type || undefined,
            id_Unit: form.id_Unit || undefined,
            user: localStorage.getItem('username'),
            address: form.address,
            status: form.status
        };

        try {
            const data: any = await this._updateAddressById.execute(address)

            this._messageService.add({
                severity: 'success',
                summary: 'Actualizado!',
                detail: data.message || 'Actualizado correctamente',
            });
            this.close();
        }

        catch (error) {
            console.log(error)
        }

    }

    validateTypeParam(parameter_Type: string) {
      // if (parameter_Type == AddressType.FISCAL ){
        this.formDirection.get('parameter_Type').disable()
      // }
    }
    close() {
        this._dialogRef.close()
    }
}
