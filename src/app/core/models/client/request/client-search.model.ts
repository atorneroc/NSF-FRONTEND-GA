import { PaginationModel } from '../../common/pagination.model';
export interface ClientSearchModel extends PaginationModel {
    term?: string;
    idCompany?: number;
    idTypeClient?: number;
    idStatusCreditLine?: boolean;
    idStatusSap?: number;
}