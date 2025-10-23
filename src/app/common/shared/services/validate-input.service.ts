import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class ValidateInputService {

    constructor() { }

    validate(formControlName: AbstractControl): string {

        if (formControlName.touched && formControlName.errors) {
            return 'ng-invalid ng-dirty'
        }

        else if (formControlName.touched) {
            return 'ng-valid ng-clean'
        }

        else {
            return ''
        }
    }

}