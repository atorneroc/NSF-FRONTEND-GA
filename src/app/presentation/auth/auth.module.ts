import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/common/shared/primeng/primeng.module';

const COMPONENTS = [
    LoginComponent
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

        AuthRoutingModule,
        PrimeNGModule
    ]
})

export class AuthModule { }
