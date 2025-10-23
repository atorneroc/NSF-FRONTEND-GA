import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManageRatesComponent } from "./manage-rates/manage-rates.component";


const routes: Routes = [

    { path: '', component: ManageRatesComponent, data: { titulo: 'Gestionar Tarifas' } },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RatesRoutingModule { }