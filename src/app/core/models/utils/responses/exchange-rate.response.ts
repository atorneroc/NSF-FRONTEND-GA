export interface ExchangeRateResponse {
    id: number;
    fecha_cambio: string | null;
    certificado_compra: number;
    certificado_venta: number;
    banco_compra: number;
    banco_venta: number;
    paralelo_compra: number;
    paralelo_venta: number;
    fecha_creacion: string;
    usuario_creacion: number;
    fecha_modificacion: string | null;
    usuario_modificacion: number;
}