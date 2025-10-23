import { PaginatedModel } from "../../common/request/paginated.request";

export interface LiquidationSearchRequest extends PaginatedModel {

    term: string;
    id_company: number;
    id_business_unit: number;
    id_branch_office: number;
    id_store: number;
    id_status: number;
    type_currency: number;
    user: string

}
