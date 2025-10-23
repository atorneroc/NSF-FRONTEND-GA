import { PaginationModel } from './pagination.model';
export interface ClientModel {

    id?: number;
    type_param?: number;
    client_Type_Parameter?: number;
    client_SubType_Parameter?: number;
    identity_Card_Number?: string;
    segmentation_Code?: number;
    id_Type_Document?: number;
    geographic_location_id?: number;
    business_Name?: string;
    industry_Code?: number;
    telephone?: string;
    fedex_Account?: string;
    authorized_Fedex_Account?: boolean;
    fedex_authorization_date?: string;
    address_Description?: string;
    commercial_Name?: string;
    comment?: string;
    currency_Type?: number;
    corporate_Group_Parameter?: number;
    holding_Parameter?: number;
    sap_id?: string;
    status?: boolean;
    status_client? : string
    sap_state_param?: string;
    sap_Migration_Status?: number;
    validate_status_param?: number;
    creation_date?: string;
    creation_author?: number;
    modification_date?: string;
    modification_author?: number;
    code_Country?: number;
    description_Country?: string

    type_client_description?: string;
    scharff?: string;
    fedex?: string;
    statusScharff?: string;
    statusFedex?: string;
    sap_Status_Description?: string;
    code_sap?: string;
    id_Sap_Status?: number;
    id_Sap?: string;
    id_Ubication?: number;
    sap_Observation?: string;

    client_Type_Description?: string;
    client_SubType_Description?: string;
    economic_Sector_Description?: string;
    id_Country?: number;
    billing_Email?: string;
    migrar_informacion_sap?: boolean;
    withholding_Agent?: boolean;
    authorize_Fedex?: boolean;
    sunat_Regime?: boolean;
    user?:string;
    client_Type_Integration_Code?: string;
    previous_Integration_Code?: string;
    domicile_condition_detail?: string;
    contributing_state_detail?: string;

    //Descripciones tabla Parametro
    business_Group_Description?: string;
    industry_Code_Description?: string;
    currency_Type_Description?: string;
    identity_Card_Type_Description?: string;
    holding_Description?: string;
    segmentation_Code_Description?: string;

  
    //CLIENTES CON RUC
    document_number?: string
    commercial_segmentation?: string
    sap_Code?: string
}

export interface ClientSearch extends PaginationModel {
    term?: string;
    idCompany?: number;
    idTypeClient?: number;
    idStatusCreditLine?: boolean;
    idStatusSap?: number;
    user: string
}

export interface AdditionalData {
    id_Client?: number,
    client_Additional_Data?: detailSaveAdditionalData[];
    type_Parameter?: number;
    status?: boolean;
}

export interface detailSaveAdditionalData {
    type_param?: number;
    status?: boolean;
}

export interface ClientSapModel {
  idCliente: number,
  pais: string,
  nombre: string,
  region: string,
  calle: string,
  direccion: string,
  telefono: string,
  ramo: string,
  distrito: string,
  documento: string,
  tipoDocumento: string,
  grupoTesoreria: string,
  condicionPago: string,
  tipoCliente: number
}
