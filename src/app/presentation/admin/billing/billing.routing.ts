import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManageBillingComponent } from "./manage-billing/manage-billing.component";


const routes: Routes = [

    { path: '', component: ManageBillingComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BillingRoutingModule { }