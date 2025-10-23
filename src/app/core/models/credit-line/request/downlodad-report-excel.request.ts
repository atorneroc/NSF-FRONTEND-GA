export interface DownloadReportExcelRequest {
  id_company: number;
  id_status: number;
  id_cliente?: number;
  id_moneda?: number;
  id_tipo_reporte: string;
}
