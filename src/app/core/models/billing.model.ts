import { PaginationModel } from "./pagination.model";

export interface BillingModel {
    id?: number;
    business_name?: string;
    company_name?: string;
    branch_office_name?: string;
    unit_name?: string;
    money_type_description?: string;
    status?: boolean;

    type_param?: number
    invoice_serial_number?: number
    client_id?: number
    purchase_order_number?: string
    broadcast_date?: string
    expiration_date?: string
    comment?: string
    invoice_ticket_id?: number
    consolidated_billing_fedex?: boolean
    consolidated_invoice?: boolean
    free?: boolean
    current_exchange_rate?: number
    company_id?: number
    branch_office_id?: number
    unit_id?: number
    creation_date?: string
    creation_author?: number
}

export interface BillingSearch extends PaginationModel {
    idclient?: number;
    company_id?: number;
    business_unit_id?: number;
    branch_office_id?: number;
}