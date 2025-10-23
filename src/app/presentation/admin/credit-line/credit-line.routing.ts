import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManageCreditLineComponent } from "./manage-credit-line/manage-credit-line.component";


const routes: Routes = [

    { path: '', component: ManageCreditLineComponent, data: { titulo: 'Gestionar Linea de Credito' } },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CreditLineRoutingModule { }