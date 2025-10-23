import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageSettlementComponent } from './manage-settlement/manage-settlement.component';
import { SettlementRoutingModule } from './settlement.routing';
import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';
import { RegisterSettlementComponent } from './manage-settlement/components/register-settlement/register-settlement.component';
import { SharedModule } from 'src/app/common/shared/shared.module';
import { AddCommentComponent } from './manage-settlement/components/update-settlement/components/add-comment/add-comment.component';
import { UpdateDetailComponent } from './manage-settlement/components/update-settlement/components/update-detail/update-detail.component';
import { UpdateSettlementComponent } from './manage-settlement/components/update-settlement/update-settlement.component';
import { HttpClient } from '@angular/common/http';
import { RegisterOperationalDetailComponent } from './manage-settlement/components/register-operational-detail/register-operational-detail.component';
import { RegisterServiceComponent } from './manage-settlement/components/register-service/register-service.component';


const COMPONENTS = [
    ManageSettlementComponent,
    RegisterSettlementComponent,
    UpdateSettlementComponent,
    AddCommentComponent,
    UpdateDetailComponent,
    RegisterServiceComponent,
    RegisterOperationalDetailComponent
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
        SettlementRoutingModule,
        SharedModule,
    ],
    providers: [
        HttpClient
    ]
})

export class SettlementModule { }
