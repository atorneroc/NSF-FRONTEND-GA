import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ManageClientComponent } from "./manage-client/manage-client.component";
import { DetailClientComponent } from "./manage-client/components/detail-client/detail-client.component";



const routes: Routes = [

    { path: '', component: ManageClientComponent },
    { path: ':id', component: DetailClientComponent, data: { title: 'Información Cliente' } },

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ClientRoutingModule { }
