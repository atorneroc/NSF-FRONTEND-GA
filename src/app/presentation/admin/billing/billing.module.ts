import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingRoutingModule } from './billing.routing';

import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';
import { SharedModule } from 'src/app/common/shared/shared.module';
import { ManageBillingComponent } from './manage-billing/manage-billing.component';
import { RegisterBillingComponent } from './manage-billing/components/register-billing/register-billing.component';

const COMPONENTS = [
    ManageBillingComponent,
    RegisterBillingComponent
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
        SharedModule,
        BillingRoutingModule
    ]
})

export class BillingModule { }
