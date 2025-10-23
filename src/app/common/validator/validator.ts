import { format } from 'date-fns'
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export function setDateFormat(date: Date): string {

    return format(date, 'yyyy-MM-dd')
}

export function phoneValidator(phone: string): number {

    return (phone.startsWith('9')) ? 9 : 25
}

export function rucValidator(numberDocumentIdentity: string): boolean {

    return (numberDocumentIdentity.startsWith('1') || numberDocumentIdentity.startsWith('2'))
}

export function equalLength(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      if (value && value.length !== length) {
        return { equalLength: true };
      }
      return null;
    };
}

export function customValidator(isInvalid: boolean, object: { [key: string]: boolean }): ValidatorFn {
    return ():  { [key: string]: boolean } | null => {
        return isInvalid ?  object : null
    }
}

export function tariffValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const patternn = /^\d{0,8}(\.\d{0,3})?$/;
   
    var inputValue = control.value === null ? 0.00 :  control.value.toString();
    if (inputValue.toString().includes("+")) {
      return { 'patternn': 'El formato del campo es incorrecto.' };
    }
    let value = control.value === null ? 0.00 : control.value.toString().split('.')[0]

    //if (value.toString().replace(".", "").length>8) {
    if (value.toString().split('.')[0].length>8) {
      return { 'patternn': 'El formato del campo es incorrecto.' };
    }

    return null;
  };
}

export function minLength(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;
    if (value && value.length < length) {
      return { min: true };
    }
    return null;
  };
}

export function maxLength(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;
    if (value && value.length > length) {
      return { max: true };
    }
    return null;
  };
}
