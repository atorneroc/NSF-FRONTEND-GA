import { environment } from "src/environments/environment";

// Backend Client
export const CLIENT_URL                 = `${environment.API_URL_CLIENT}client`
export const CLIENT_SAP_URL             = `${environment.API_URL_CLIENT_SAP}SAP`

// Backend Utils
export const UTILS_URL                  = `${environment.API_URL_UTILS}util`
export const SECURITY_URL                  = `${environment.API_URL_UTILS}security`

// Backend Billing
export const BILLING_URL                = `${environment.API_URL_BILLING}billing`

// Backend Credit Line
export const CREDIT_LINE_URL            = `${environment.API_URL_CREDIT_LINE}creditLine`

// Backend Liquidation
export const LIQUIDATION_URL            = `${environment.API_URL_LIQUIDATION}liquidation`
export const SERVICE_URL                = `${environment.API_URL_LIQUIDATION}services`
export const OPERATIONAL_DETAIL_URL     = `${environment.API_URL_LIQUIDATION}operationaldetails`
export const RATE_URL                   = `${environment.API_URL_LIQUIDATION}rate`
export const AD_URL                   = `${environment.API_URL_AD}`

export const AD_URL_BILLING           = `${environment.API_URL_AD_BILLING}`

// Backend Charlie
export const CHARLIE_URL                 = `${environment.API_URL_CHARLIE}Integration`

