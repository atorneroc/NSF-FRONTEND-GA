export interface ExchangeRateModel {

    id?: number;
    change_date?: string;
    certificate_purchase?: number;
    certificate_sale?: number;
    bank_purchase?: number;
    bank_sale?: number;
    parallel_purchase?: number;
    parallel_sale?: number;
    creation_date?: string;
    creation_author?: number;
    modification_date?: string;
    modification_author?: number;

}