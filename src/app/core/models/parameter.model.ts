export interface ParameterModel {
    id: number;
    name?: string;
    description: string;
    correlational_code?: string;
    attribute_length: number;
    sap_code?:string;
    tci_code?: string
    detail_code?:string;
    id_estructura_base?:number;
    min_val?: number;
    max_val?: number;
    code?: string;
}