import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { errorAnimation } from './error-message.animation';


@Component({
    selector: 'error-message',
    templateUrl: './error-message.component.html',
    animations: [errorAnimation]
})

export class ErrorMessageComponent implements OnInit {

    @Input() formControlError: AbstractControl
    @Input() minLength: number
    @Input() equalLength: number
    @Input() maxLength: number
    @Input() min: number
    @Input() max: number

    @Input() tariffValidator:any
    constructor() { }

    ngOnInit() { }
}
