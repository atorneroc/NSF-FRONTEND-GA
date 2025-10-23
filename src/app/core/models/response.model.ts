export interface ResponseData<T> {
    message: string,
    data: T,
    error: string[],
    success?: boolean,   // Indica si la operación fue exitosa
    statusCode?: number,  // Código de estado HTTP
}