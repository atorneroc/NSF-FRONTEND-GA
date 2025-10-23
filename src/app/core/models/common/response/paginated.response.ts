export interface PaginatedResponse<T> {

    result: T[];
    additional_data: AdditionalData
}

export interface AdditionalData {

    total_rows: number
    total_price_local_currency: number
    total_price_foreign_currency: number
}