import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})

export class MessageError {

    constructor(
        private _messageService: MessageService,
    ) { }

    messageError(type: any) {
        const data = {
            'invalid': 'Completar los campos necesarios',
            'invalidPhone': 'Los telefonos no pueden ser iguales',
            'invalidEmail': 'Los correos no pueden ser iguales',
            'empty-settelement': 'Por favor, ingrese 1 o más detalles operativos',
            'exist-fiscal-address': 'Ya cuenta con una dirección fiscal activa',
            'exist-internal-contact': 'Ya cuenta con un contacto interno activo para el área ingresada',
            'pristine': 'No ha realizado cambios. Por favor, edita un elemento para poder actualizarlo.',
            'lengtNumberDocumentIdentity': 'La longitud del Nro. de documento de identidad es inválida',
            'rucInvalid': 'El RUC debe de empezar con los dígitos 1 o 2.',
            'phoneInvalidLength': 'Por favor, ingresa un teléno válido.',
            'emptyAdditionalData': 'Selecciona al menos un dato adicional del listado, por favor.',
            'clientDuplicated': 'El cliente con el número de documento ingresado ya se encuentra registrado'
        };
        return data[type] || 'Ocurrió un error de validación';
    }

    show(form: any, condition: boolean, type: any): boolean {
        if (condition) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Atención',
                detail: this.messageError(type),
            });
            type == 'invalid' ? form?.markAllAsTouched() : null;
        }
        return condition;
    }

}
