import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRepository } from './repositories/client/client.repository';
import { ContactRepository } from './repositories/client/contact.repository';
import { AddressRepository } from './repositories/client/address.repository';
import { ClientWebRepository } from '../data/repository/client/web/client-web.repository';
import { ContactWebRepository } from '../data/repository/client/web/contact-web.repository';
import { AddressWebRepository } from '../data/repository/client/web/address-web.repository';
import { UtilsRepository } from './repositories/utils/utils.repository';
import { UtilsWebRepository } from '../data/repository/utils/web/utils-web.repository';
import { LiquidationRepository } from './repositories/settlement/liquidation.repository';
import { LiquidationWebRepository } from '../data/repository/settlement/web/liquidation-web.repository';
import { BillingWebRepository } from '../data/repository/billing/web/billing-web.repository';
import { BillingRepository } from './repositories/billing/billing.repository';
import { CreditLineRepository } from './repositories/credit-line/credit-line.repository';
import { CreditLineWebRepository } from '../data/repository/credit-line/web/credit-line-web.repository';
import { ServiceRepository } from './repositories/service/service.repository';
import { ServiceWebRepository } from '../data/repository/service/service.repository';
import { OperationalDetailRepository } from './repositories/operational-detail/operational-detail.repository';
import { OperationalDetailWebRepository } from '../data/repository/operational-detail/operational-detail.repository';
import { LayoutRepository } from './repositories/layout/layout.repository';
import { LayoutWebRepository } from '../data/repository/layout/layout-web.repository';
import { BillingCutRepository } from './repositories/client/billing-cut.repository';
import { BillingCutWebRepository } from '../data/repository/client/web/billing-cut-web.repository';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    exports: [],
    providers: [

        // Client Use Cases
        { provide: ClientRepository, useClass: ClientWebRepository },
        { provide: ContactRepository, useClass: ContactWebRepository },
        { provide: AddressRepository, useClass: AddressWebRepository },
        { provide: BillingCutRepository, useClass: BillingCutWebRepository },
        
        // Billing Use Cases
        { provide: BillingRepository, useClass: BillingWebRepository },

        // Utils Use Cases
        { provide: UtilsRepository, useClass: UtilsWebRepository },

        // Liquidation Use Cases
        { provide: LiquidationRepository, useClass: LiquidationWebRepository },
        { provide: ServiceRepository, useClass: ServiceWebRepository },
        { provide: OperationalDetailRepository, useClass: OperationalDetailWebRepository },

        // Credit Line Use Cases
        { provide: CreditLineRepository, useClass: CreditLineWebRepository },

        //Layout
        { provide: LayoutRepository, useClass: LayoutWebRepository },


    ]
})

export class CoreModule { }
