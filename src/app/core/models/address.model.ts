export interface AddressModel {

    id?: number;
    status?: number;
    status_Description?: boolean;
    parameter_Type?: number;
    address_Type_Parameter?: string;
    location?: number;
    address_Type_Description?: string;
    ubigeo_code_description?: string;
    ubigeo_Description?: string;
    unit_description?: string;
    unit_Description?: string;
    ubigeo_Code? :string;
    code_Ubigeo?:string;
    id_Client?: number;
    id_Unit?: number;

    id_Ubigeo?: number;
    address?: string;
    postal_Code?: string;
    creation_date?: string;
    creation_author?: number;
    modification_date?: string;
    modification_author?: number;
    user?: string;

    // nuevos
    address_Type?: string;
    detail_Code?:string;
}
