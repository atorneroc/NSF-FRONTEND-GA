import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin.routing';
import { LayoutComponent } from './layout/layout.component';
import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';
import { SharedModule } from 'primeng/api';

const COMPONENTS = [
    LayoutComponent
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
        AdminRoutingModule
    ]
})

export class AdminModule { }
