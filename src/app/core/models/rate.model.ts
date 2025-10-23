export interface ServiceRateModel {
  id_service?: number;
  service_description?: string;
  id_service_organizational_structure?: number;
  id_base_organizational_structure?: number;
  product_description:string
  lstgroups: OperationalDetailGroup[]
}

export interface OperationalDetailGroup {
  id_group: number;
  group_name: string;
  lstdetails: RateModel[]
  isOpen?: boolean;
}

export interface RateModel {
  id_detail_operational?: number;
  operational_detail_description?: string;
  unit_measure_description?: string;
  operational_detail_price: number;
  service_description?: string;
  id_service?: number;
  id_rate?:number;
  id_unit_measure?: number;
  id_detail_operational_organizational_structure?: number;
  id_service_organizational_structure?: number;
  total_amount_operational_detail_foreign_currency?: number;
  total_amount_operational_detail_national_currency?: number;
  rate_type_parameter?: number;
  quantity?:number;
  total_price?:number;
  formIndex?: number;
  showFiles?: boolean;
  files?: File[];
  id_group:number;
  code_type_rate?: string
}

export interface ServiceRateRangeModel {
  rate_amount_range?: number;
}
