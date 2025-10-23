import { PaginationModel } from './pagination.model';
export interface CreditLineModel {

    id?: number;
    client_id?: number;
    business_group_id?: number;
    days_billing?: number;
    sale_condition?: number;
    creation_date?: string;
    creation_author?: number;
    modification_date?: string;
    modification_author?: number;
    company_id?: number;
    idCompany?: number;
    company_description?: string;
    state_Line?: string;
    Id_Client?: number;

    id_Client?: number;
    id_Company?: number;
    id_Modality?: number;
    id_Money?: number;
    id_CreditLine?: number;
    start_Date?: string;
    overdraft_Percentage?: number;
    amount_Line?: number;
    state_CreditLine?: number;
    user?:string;

    company_Name?:string;
    modality?: string;
    money?: string;
    status?: number
    creditLine?: number;


}

export interface CreditLineSearch extends PaginationModel {
    term?: string;
    company_id?: number;
    idclient?: number;
    Id_State?: number;
    Id_Money?: number;
    Id_Modality?: number;
    Id_Company?: number;
    user: string
  }
