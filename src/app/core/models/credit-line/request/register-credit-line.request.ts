export interface RegisterCreditLineRequest {
  id_CreditLine?: number;
  id_Client?: number;
  id_Company?: number;
  id_Modality?: number;
  id_Money?: number;
  start_Date?: string;
  overdraft_Percentage?: number;
  amount_Line?: number;
  state_CreditLine?: number;
  user?:string;
  status?: number;

  payment_modality_id?: number
  broadcast_date?: string
  collection_manager_id?: number
  observation?: string
  indirect_company_id?: number
  indirect_financial_entity_id?: number
  indirect_financing_type_id?: number
  indirect_currency_type_id?: number
  indirect_awarded_line_amount?: number
  indirect_payment_modality_id?: number
  indirect_tea_percentage?: number
  indirect_observation?: string
  ind_credit_line?: number
  ind_unlimited_credit?: number
  operational_lock?: boolean
}
