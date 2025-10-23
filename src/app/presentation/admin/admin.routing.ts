import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from "./layout/layout.component";

const DEFAULT_ROUTE: string = 'home'

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [

            // Ruta Default
            {
                path: '',
                redirectTo: DEFAULT_ROUTE,
                pathMatch: 'full'
            },
            // Home
            {
              path: 'home',
              loadChildren: () => import('./Home/home.module').then(m => m.HomeModule),
              data: { title: 'Inicio' }
            },
            // Client Module
            {
                path: 'client',
                loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
                data: { title: 'Búsqueda Cliente' }
            },

            // Billing Module
            {
                path: 'billing',
                loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule),
                data: { title: 'Facturación' }
            },

            // Rates Module
            {
                path: 'rates',
                loadChildren: () => import('./rates/rates.module').then(m => m.RatesModule),
                data: { title: 'Tarifa' }
            },

            // Settlement Module
            {
                path: 'settlement',
                loadChildren: () => import('./settlement/settlement.module').then(m => m.SettlementModule),
                data: { title: 'Liquidación' }
            },

            // Credit-Line Module
            {
                path: 'credit-line',
                loadChildren: () => import('./credit-line/credit-line.module').then(m => m.CreditLineModule),
                data: { title: 'Línea de Crédito' }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})

export class AdminRoutingModule { }
