import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRatesComponent } from './manage-rates/manage-rates.component';
import { RatesRoutingModule } from './rates.routing';
import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';

const COMPONENTS = [
    ManageRatesComponent
]

@NgModule({
    declarations: [
        COMPONENTS
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeNGModule,
        
        RatesRoutingModule
    ]
})

export class RatesModule { }
