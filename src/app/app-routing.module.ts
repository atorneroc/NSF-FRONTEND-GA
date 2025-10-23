import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaslGuard } from './masl.guard';


const DEFAULT_ROUTE: string = 'login'

const routes: Routes = [
    {
         path: '',
        redirectTo: DEFAULT_ROUTE,
        pathMatch: 'full'
    },

    // Auth module
    {
        path: 'login',
        loadChildren: () => import('./presentation/auth/auth.module').then(m => m.AuthModule)
    },

    // Admin module
    {
        path: 'admin',
        loadChildren: () => import('./presentation/admin/admin.module').then(m => m.AdminModule),
        canActivate: [MaslGuard]
    },
    {
        path: '**',
        redirectTo: DEFAULT_ROUTE
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule { }
