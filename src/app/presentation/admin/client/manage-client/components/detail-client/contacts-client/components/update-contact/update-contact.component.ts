import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageError } from 'src/app/common/validator/error-message';
import { setLengthPhone } from 'src/app/common/validator/phone';
import { ContactModel, UpdateContact } from 'src/app/core/models/contact.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetContactByIdUsecase } from 'src/app/core/usecase/client/contact/get-contact-by-id.usecase';
import { UpdateContactByIdUsecase } from 'src/app/core/usecase/client/contact/update-contact-by-id.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';

@Component({
    selector: 'app-update-contact-component',
    templateUrl: './update-contact.component.html',
})

export class UpdateContactComponent implements OnInit {

    displayPhone: boolean = false;
    displayEmail: boolean = false;
    phonesContact: any[] = []
    emailsContact: any[] = []

    formContact: FormGroup;
    idContact: number;

    typeContact: ParameterModel[] = [];
    areaContact: ParameterModel[] = [];

    // Logitud máxima de teléfono
    maxLengthPhone = null;
    maxLengthPhone1 = 20;
    minLengthPhone=0;

    // Valor del teléfono 1
    phone1 = null

    // Valor del teléfono 2
    phone2 = null

    hasInvalidLenghtPhone: boolean = false;

    previousAreaType: number = null;

    status = [
        {
            id: true,
            description: 'Activo'
        },
        {
            id: false,
            description: 'Inactivo'
        }
    ];

    constructor(
        private _formBuilder: FormBuilder,
        private _dialogRef: DynamicDialogRef,
        public validateService: ValidateInputService,
        private _config: DynamicDialogConfig,
        private _getParameterById: GetParameterByIdUseCase,
        private _getContactById: GetContactByIdUsecase,
        private _updateContact: UpdateContactByIdUsecase,
        private _messageService: MessageService,
        private _messageError: MessageError
    ) { }

    ngOnInit() {
        this.idContact = this._config.data.idContact

        this.createFormClient()
        this.getAllTypeContacts()
        this.getAllAreaContacts()
        this.getContactById(this.idContact)
    }

    createFormClient() {
        this.formContact = this._formBuilder.group({
            full_Name: [null, Validators.required],
            type_Parameter: [null, Validators.required],
            area_Parameter: [null, Validators.required],
            status: [null],
            phone1: [null,  [Validators.maxLength(this.maxLengthPhone1), Validators.minLength(this.minLengthPhone), Validators.required]],
            phone2: [null,  [Validators.maxLength(this.maxLengthPhone1), Validators.minLength(this.minLengthPhone)]],
            email1: [null, [Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"), Validators.required ]],
            email2: [null, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")],
            comment: [null]
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
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getContactById(idContact: number) {
        try {
            const response: ResponseData<ContactModel> = await this._getContactById.execute(idContact)

            this.previousAreaType = response.data.area_Parameter
            this.phonesContact = response.data['phones_Contact']
            this.emailsContact = response.data['emails_Contact']
            this.formContact.patchValue(response.data)

            this.phonesContact.sort()
            this.emailsContact.sort()

            this.setValueByPhoneOrEmail('phone', this.phonesContact)
            this.setValueByPhoneOrEmail('email', this.emailsContact)

            if(this.phonesContact.length > 1) this.addPhone()
            if(this.emailsContact.length > 1) this.addEmail()
        }
        catch (error) {
            console.log(error)
        }
    }

    setValueByPhoneOrEmail(name: string, array: Array<any>){
        for (const [index, value] of array.entries()) {
            const nameForm =  `${name}${(index + 1)}`
            this.formContact.controls[nameForm].setValue(value.phone || value.email)
        }
    }

    async updateContact() {

        const form = this.formContact.value
        const formContact = this.formContact

        const isInvalidForm = this._messageError.show(formContact, this.formContact.invalid, 'invalid')
        const existInternalContact = this._messageError.show(this.formContact, this.validateTypeContactAndTypeArea(form.type_Parameter, form.area_Parameter, this.previousAreaType), 'exist-internal-contact');
        const isSamePhone = this._messageError.show(formContact, ((form.phone1 && form.phone2) && form.phone1 == form.phone2), 'invalidPhone')
        const isSameEmail = this._messageError.show(formContact, ((form.email1?.trim() && form.email2?.trim()) && form.email1?.trim() == form.email2?.trim()), 'invalidEmail')

        if(isInvalidForm  || isSamePhone || isSameEmail || existInternalContact) return;

        const contact: UpdateContact = {
            id: Number(this._config.data.idContact),
            full_Name: form.full_Name,
            type_Parameter: form.type_Parameter,
            area_Parameter: form.area_Parameter,
            user: localStorage.getItem('username'),
            phones_Contact: form.phone2 ? [{ id: this.phonesContact[0]?.id || 0, phone: form.phone1?.toString() }, { id: this.phonesContact[1]?.id || 0, phone: form.phone2?.toString() }] : [{ id: this.phonesContact[0]?.id || 0, phone: form.phone1?.toString() }],
            emails_Contact: form.email2 ? [{ id: this.emailsContact[0]?.id || 0, email: form.email1 }, { id: this.emailsContact[1]?.id || 0, email: form.email2 }] : [{ id: this.emailsContact[0]?.id || 0, email: form.email1 }],
            comment: form.comment,
            status: form.status
        }

        try {
            const data: any = await this._updateContact.execute(contact)

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

    validateTypeContactAndTypeArea(typeContact: number, typeArea: any, previousAreaType: number): boolean {
        const [area] = this.areaContact.filter(area => area.id === typeArea)
        return typeContact === 15 && previousAreaType !== typeArea && this.verifyIfExistAreaByName(area.description)
    }

    verifyIfExistAreaByName(typeArea:string): boolean{
        const areas: Array<any> = this._config.data.contactList
        const existArea = areas.filter(area => area.description_area_contact ===  typeArea)
        return existArea.length > 0
    }

    close() {
        this._dialogRef.close()
    }

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

    addPhone() {
        const isDisplayPhone = this.displayPhone
        this.displayPhone = !isDisplayPhone
        if(!this.displayPhone) this.formContact.controls['phone2'].setValue(null);
    }

    addEmail() {
        const isDisplayEmail = this.displayEmail
        this.displayEmail = !isDisplayEmail

        if(!this.displayEmail) this.formContact.controls['email2'].setValue(null);
    }

}
