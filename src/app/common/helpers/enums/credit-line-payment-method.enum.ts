export enum CreditLinePaymentMethod {
    Contado = "CONT"
}

export enum CreditLineStatus {
  Activo = 'SCL02',
  Bloqueado = 'SCL03',
  BloqueadoPorDeuda = 'SCL07',
  Sobregirado = 'SCL01',
  Contado = 'SCL04',
  Ilimitado = 'SCL05',
  BloqueoOperativo = 'SCL06'
}