import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCreditLineComponent } from './manage-credit-line/manage-credit-line.component';
import { CreditLineRoutingModule } from './credit-line.routing';
import { RegisterCreditLineComponent } from './manage-credit-line/components/register-credit-line/register-credit-line.component';
import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';
import { UpdateCreditLineComponent } from './manage-credit-line/components/update-credit-line/update-credit-line.component';
import { DetailsConsumptionComponent } from './manage-credit-line/components/details-consumption/details-consumption.component';
import { SharedModule } from 'src/app/common/shared/shared.module';
import { GenerateReportComponent } from './manage-credit-line/components/generate-report/generate-report.component';
import { HttpClient } from '@angular/common/http';

const COMPONENTS = [
    ManageCreditLineComponent,
    RegisterCreditLineComponent,
    UpdateCreditLineComponent,
    GenerateReportComponent,
    DetailsConsumptionComponent
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
        CreditLineRoutingModule,
        SharedModule
    ],
    providers: [
        HttpClient
    ]
})

export class CreditLineModule { }
