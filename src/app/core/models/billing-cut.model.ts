export interface BillingCutModel {
    id_Company: number;
    company: string;
    billignCuts: BillingCut[];
}

export interface BillingCut {
    id: number;
    id_Client: number;
    id_Company: number;
    company: string;
    id_Business_Unit: number;
    businessUnit: string;
    id_Product: number;
    product: string;
    id_BillingCut_Type: number;
    billingCut_Type: string;
    status: boolean;
    creation_date?: string;
    creation_author?: number;
    modification_date?: string;
    modification_author?: number;
}


export interface BillingCutDetailDto {
    id?: number
    id_BusinessUnit: number;
    id_Product: number | null;
    id_BillingCut_Type: number;
    creation_User: string;
    status:boolean;
  }
  
  export interface RegisterBillingCut {
    id_Company: number;
    id_Client: number;
    lstBillingCut?: BillingCutDetailDto[];
  }