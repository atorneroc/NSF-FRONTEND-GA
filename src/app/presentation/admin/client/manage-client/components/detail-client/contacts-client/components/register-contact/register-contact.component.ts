import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageError } from 'src/app/common/validator/error-message';
import { setLengthPhone } from 'src/app/common/validator/phone';
import { RegisterContact } from 'src/app/core/models/contact.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { RegisterContactByClientIdUsecase } from 'src/app/core/usecase/client/contact/register-contact-by-client-id.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';

@Component({
    selector: 'app-register-contact-component',
    templateUrl: './register-contact.component.html',
})

export class RegisterContactComponent implements OnInit {

    displayPhone: boolean = false;
    displayEmail: boolean = false;

    formContact: FormGroup;
    idContact: string;

    typeContact: ParameterModel[] = [];
    areaContact: ParameterModel[] = [];
    areaContactAll: ParameterModel[] = [];


    // Logitud máxima de teléfono
    maxLengthPhone = null;
    maxLengthPhone1 = 20;
    minLengthPhone=0;

    // Valor del teléfono 1
    phone1 = null

    // Valor del teléfono 2
    phone2 = null

    // Flag que indica si los dos telefono ingresados son iguales
    isSamePhones: boolean = false;

    // Telefono
    phone = null

    hasInvalidRuc: boolean = false;

    hasInvalidLenghtPhone: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _confirmationService: ConfirmationService,
        public validateService: ValidateInputService,
        private _dialogRef: DynamicDialogRef,
        private _config: DynamicDialogConfig,
        private _getParameterById: GetParameterByIdUseCase,
        private _registerContact: RegisterContactByClientIdUsecase,
        private _messageService: MessageService,
        private _messageError: MessageError
    ) { }

    ngOnInit() {
        this.createFormClient()
        this.getAllTypeContacts()
        this.getAllAreaContacts()
        this.idContact = this._config.data.lastIdContact + 1
    }

    createFormClient() {
        this.formContact = this._formBuilder.group({
            full_Name: [null, Validators.required],
            typeContact: [null, Validators.required],
            areaContact: [null, Validators.required],
            phone1: [null,  [Validators.maxLength(this.maxLengthPhone1), Validators.minLength(this.minLengthPhone), Validators.required]],
            phone2: [null,  [Validators.maxLength(this.maxLengthPhone1), Validators.minLength(this.minLengthPhone)]],
            email1: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.required ]],
            email2: [null, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")],
            comments: [null]
        });
    }

    async getAllTypeContacts() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("6")
            this.typeContact = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllAreaContacts() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("7")
            this.areaContact = response.data
            this.areaContactAll = this.areaContact
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    addPhone() {
        const isDisplayPhone = this.displayPhone
        this.displayPhone = !isDisplayPhone
    }

    addEmail() {
        const isDisplayEmail = this.displayEmail
        this.displayEmail = !isDisplayEmail
    }

    async getTypContact(event) {

        if(!event.value) return
        const idContact = event.value.id;
        const [typecontact]=this.typeContact.filter(element => element.id === idContact)
        if(typecontact.detail_code === '2') {
            this.areaContact = this.areaContact.filter(element => element.correlational_code !== 'TC001')
        } else {
            this.areaContact = this.areaContactAll
        }
    }

    async registerContact() {
        const form = this.formContact.value
        const formContact = this.formContact

        const isInvalid = this._messageError.show(formContact, this.formContact.invalid, 'invalid')
        const isSamePhone = this._messageError.show(formContact, ((form.phone1 && form.phone2) && form.phone1 == form.phone2), 'invalidPhone')
        const isSameEmail = this._messageError.show(formContact, ((form.email1?.trim() && form.email2?.trim())&& form.email1?.trim() == form.email2?.trim()), 'invalidEmail')
        const isPhoneInvalid = this._messageError.show(null, this.hasInvalidLenghtPhone, 'phoneInvalidLength');
        const [typecontact]=this.typeContact.filter(element => element.id === form.typeContact.id)
        const [areacontact]=this.areaContact.filter(element => element.id === form.areaContact.id)
        const existInternalContact = this._messageError.show(this.formContact, this.validateTypeContactAndTypeArea(typecontact.detail_code, form.areaContact.description,areacontact.detail_code), 'exist-internal-contact');

        if(isInvalid  || isSamePhone || isSameEmail || isPhoneInvalid || existInternalContact ) return;

        const contact: RegisterContact = {
            id_Client: Number(this._config.data.idClient),
            type_Parameter: form.typeContact.id,
            area_Parameter: form.areaContact.id,
            full_Name: form.full_Name,
            comment: form.comments,
            user: localStorage.getItem('username'),
            phones_Contact: form.phone2 ? [{ phone: form.phone1?.toString() }, { phone: form.phone2?.toString() }] : [{ phone: form.phone1?.toString() }],
            emails_Contact: form.email2 ? [{ email: form.email1?.toString() }, { email: form.email2?.toString() }] : [{ email: form.email1?.toString() }],
        }

        try {
            const data: any = await this._registerContact.execute(contact)

            this._messageService.add({
                severity: 'success',
                summary: 'Registrado!',
                detail: data.message || 'Registrado correctamente',
              });

            this.close();
        }

        catch (error) {
            console.log(error)
        }
    }

    validateTypeContactAndTypeArea(typeContact: string, typeArea: string, CodetypeArea: string): boolean{

        return this.verifyIfExistAreaByName(typeArea,CodetypeArea,typeContact)
    }

    verifyIfExistAreaByName(typeArea:string,CodetypeArea:string,typeContact:string): boolean{

        const areas: Array<any> = this._config.data.contactList
        const existArea = areas.filter(area => area.area_Contact_Description ===  typeArea && area.status===true && area.code_Area_Parameter===CodetypeArea && area.code_Type_Parameter===typeContact)
        return existArea.length > 0
    }

    close() {
        this._dialogRef.close()
    }

    validate(control: string) {
        if (this.formContact.controls[control].touched) {
            if (this.formContact.controls[control].errors) return 'ng-invalid ng-dirty'
            else return 'border-success'
        }
        else return ''
    }

    // Si telefono 1 es igual al telefono 2 agregar en un flag que los telefónos son iguales

    onPhoneInputPhone1(event: any, phone: string): void {

        this.phone1 = String(event.value)
        this.maxLengthPhone = setLengthPhone(event)
        this.setErrorByPhone(phone, this.phone1)
    }

    setErrorByPhone(phone: string, arg: string){
        const phoneData = this.formContact.controls[phone];

        if(arg?.length < this.maxLengthPhone && this.maxLengthPhone === 9){
            this.hasInvalidLenghtPhone = true;
            phoneData.setErrors({ errorLengthPhone: true });
            return
        }
        this.hasInvalidLenghtPhone = false;
        phoneData.setErrors({ errorLengthPhone: null });
    }

    onPhoneInputPhone2(event, phone: string) {
        this.phone2 = String(event.value)
        this.maxLengthPhone = setLengthPhone(event)
        this.setErrorByPhone(phone, this.phone2)
    }


    get email1() {
        return this.formContact.get('email1');
    }

    get email2() {
        return this.formContact.get('email2');
    }
}
