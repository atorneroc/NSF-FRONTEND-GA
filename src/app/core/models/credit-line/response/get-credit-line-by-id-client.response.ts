export interface GetCreditLineByIdClientResponses {
    id_CreditLine : number
    id_Client : number
    id_Company : number
    client_Name  : string
    company_Name  : string
    id_Modality : number
    modality  : string
    id_Money : number
    money  : string
    start_Date : string
    amount_Line : number //LC.Otorgada
    status  : string
    days: number
    code_Modality: string
    is_Blocked: boolean
    is_Unlimited: boolean
    code_Money_Credit_Line: string
    balance_Amount: number  //Saldo Disponible
    consumption: number    //LC.Consumida
    detail_code_status: string
    blocked_operations: boolean
    code_tci_credit_line: string
    overdraft_percentage: number // Sobregiro
    amount_line_available: number
  }
  
  
  
  
  