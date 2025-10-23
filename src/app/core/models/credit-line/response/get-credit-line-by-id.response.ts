export interface GetCreditLineByIdResponse {
  id_CreditLine : number
  id_Client : number
  id_Company : number
  payment_modality_id : number
  ind_credit_line: number
  ind_unlimited_credit: number
  id_Money : number
  amount_Line : number
  broadcast_date: Date
  overdraft_Percentage: number
  client_Name:string
  company_Name:string
  consumption?: number
  status_id?: number
  operational_lock?:boolean
}
