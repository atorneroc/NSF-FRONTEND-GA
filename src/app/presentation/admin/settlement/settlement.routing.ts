import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { RegisterSettlementComponent } from "./manage-settlement/components/register-settlement/register-settlement.component";
import { UpdateSettlementComponent } from "./manage-settlement/components/update-settlement/update-settlement.component";
import { ManageSettlementComponent } from "./manage-settlement/manage-settlement.component";


const routes: Routes = [

    { path: '', component: ManageSettlementComponent},
    { path: 'register', component: RegisterSettlementComponent},
    { path: 'update/:id', component: UpdateSettlementComponent}

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SettlementRoutingModule { }