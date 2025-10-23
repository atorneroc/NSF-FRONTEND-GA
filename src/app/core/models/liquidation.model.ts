import { PaginationModel } from './pagination.model';
export interface LiquidationModel {
  id?: number;
  id_Client?: number;
  service_Start_Date?: string;
  service_finish_date?: string;
  type_Currency_Parameter?: number;
  exchange_Rate_Value?: number;
  id_Company?: number;
  id_Business_Unit?: number;
  id_Branch_Office?: number;
  id_Store?: number;
  total_Amount_Liquidation?: number;
  total_Amount_Liquidation_Foreign_Currency?: number;
  total_Amount_Liquidation_National_Currency?: number;


  status_Parameter?: number;
  name_Company?: string;
  name_Business_Unit?: string;
  name_Branch_Office?: string;
  name_store?: string;
  name_Client?: string;
  subtotal_Price?: number;
  igv_Price?: number;
  igv?: number;
  code_Status?: string;
  description_Status?: string;
  id_exchange_rate?: number;

  tariff_id?: number;
  quantity?: number;
  certificate_sale?: number;
  amount?: number;

  discount_rate_param?: number;
  discount?: number;
  business_group_id?: number;
  affection_igv?: boolean;
  id_Liquidation?: boolean
  user:string
  liquidation_Detail_Operational?: any[];
  liquidation_Detail_Operational_bd?: any[];
}

export interface LiquidationDeatilModel {
  creation_Date: string;
  creation_Author: number;
  modification_Date: string;
  modification_Author: number;
  id_Liquidation: number;
  id_Client: number;
  name_Client: string;
  service_Start_Date: string;
  service_Finish_Date: string;
  type_Currency_Parameter: number;
  currency_Description: string;
  exchange_Rate_Value: number;
  total_Amount_Liquidation: number;
  total_Amount_Liquidation_Foreign_Currency: number;
  total_Amount_Liquidation_National_Currency: number;

  id_detail_operational: number;
  operational_detail_description: string;
  unit_measure_description: string;
  operational_detail_price: number;
  service_description: string;
  id_service: number;
  id_unit_measure: number;
  quantity: number;
  id_detail_operational_organizational_structure: number;
  id_service_organizational_structure: number;
  rate_type_parameter: number;
  id_Liquidation_Detail_Service: number;

  id: number;

  unit_Amount_Operational_Detail: number;
  total_Amount_Operational_Detail: number
  total_amount_operational_detail_foreign_currency: number;
  total_amount_operational_detail_national_currency: number;
  id_Type_Operational_Detail: number;

  id_Company: number;
  id_Branch_Office: number;
  id_Business_Unit: number;
  id_Store: any;

  formIndex?: number;
}


export interface SettlementDetail {
  id?: number;
  operational_detail_description?: string;
  unit_measure_param?: number;
  unit_measure_description?: string;
  quantity?: number;
  operational_detail_price?: number;
  total_price?: number;
  total_Amount_Operational_Detail?: number;
  igv?: number;
  results?: LiquidationDeatilModel[]
}

export interface liquidationDeatilRequest {

}

export interface liquidationDetail {
  id_Company?: number;
  id_Branch_Office?: number;
  id_Business_Unit?: number;
  store?: number;
  idStore?: number;
  client_id?: number;
  service_Start_Date?: string;
  service_Finish_Date?: string;
  id_exchange_rate?: number;
  status_Parameter?: number;

  id_detail_operational_organizational_structure?: number;
  id_service_organizational_structure?: number;
  id_unit_measure?: number;
  unit_Amount_Operational_Detail?: number;
  total_Amount_Operational_Detail?: number;
  total_amount_operational_detail_foreign_currency?: number;
  total_amount_operational_detail_national_currency?: number;

  type_Currency_Parameter?: number;
  liquidation_id?: number;
  id_Liquidation?: number;
  liquidation_detail: Array<SettlementDetail>;
}

export interface LiquidationSearch extends PaginationModel {
  idclient?: number;
  company_id?: number;
  business_unit_id?: number;
  branch_office_id?: number;
  status_id?: number;
  store_id?: number;
  term?: string;
  TypeCurrency?: number;
  BankPurchase?: number;
  idStore?: number;
}

export interface RateSearch {
  idStore?: number;
  company_id?: number;
  branch_office_id?: number;
  business_unit_id?: number;
  status_id?: number;
  idclient?: number;
  idtypecurrency?: number;
  isDollarSelected?:boolean;
  lst?: number[];
}

export interface RateCreateServiceSearch {
  company_id?: number;
  branch_office_id?: number;
  business_unit_id?: number;
  isDollarSelected?:boolean;
  lstIdDetailOperational?: number[];
  lstIdServicesAdded?: number[];
  idBase?: Number;
}

export interface RateServiceSearch {
  lstIdServicesAdded?: number[];
  idBaseStructure?: number;
}

export interface RateRangeSearch {
  rateId?: number;
  quantity?: number;

}

export interface RateDetailSearch {
  idService?:number;
  lst?: number[];
  isDollarSelected?:boolean;
}
