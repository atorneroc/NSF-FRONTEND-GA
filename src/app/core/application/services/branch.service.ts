import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BillingCutEmpresa, BillingCutUnidad } from 'src/app/common/helpers/enums/client-billing-cut.enum';
import { GetClientUsecase } from 'src/app/core/usecase/client/client/get-client.usecase';
import { ParameterModel } from "src/app/core/models/parameter.model";
import { ResponseData } from "src/app/core/models/response.model";
import { GetParameterByIdUseCase } from '../../usecase/utils/get-parameter-by-id.usecase';
import { CreditLineStatus } from 'src/app/common/helpers/enums/credit-line-payment-method.enum';

type RuleKey = `${BillingCutEmpresa}-${BillingCutUnidad}`;
type FormRule = (form: FormGroup, fieldName: string) => void;

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private debounce: any;
  constructor(
    private _getClient: GetClientUsecase,
    private _getAllParameters: GetParameterByIdUseCase,
) {}

  async getClient(query: string, isGetClientByFilterActive: boolean): Promise<any[]> {
    const search = query?.trim();
  
    if (!search || search.length === 0) {
      return [];
    }
  
    return new Promise((resolve, reject) => {
      clearTimeout(this.debounce);
  
      this.debounce = setTimeout(async () => {
        if (!search || search.length === 0) return resolve([]);
  
        const request = {
          keys: '["id","descripcion_negocio", "numero_documento_identidad"]',
          value: search
        };
  
        try {
          const response = await this.getClientByFilter(request);
          const result = isGetClientByFilterActive ? (response?.data || []) : [];
          resolve(result.length ? result : [{ client_code: "No se encuentra remitente" }]);
        } catch (error) {
          console.error('Error en búsqueda:', error);
          reject(error);
        }
      }, 350);
    });
  }

  async getClientByFilter(request: any) {
    try {
      return await this._getClient.execute(request);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getClientCreditLine(query: string, typeClient:string, isGetClientByFilterActive: boolean): Promise<any[]> {
    const search = query?.trim();
    if (!search || search.length === 0) {
      return [];
    }
  
    return new Promise((resolve, reject) => {
      clearTimeout(this.debounce);
  
      this.debounce = setTimeout(async () => {
        if (!search || search.length === 0) return resolve([]);
  
        const request = {
          keys: '["id","descripcion_negocio", "numero_documento_identidad"]',
          value: search,
          typeClient: typeClient
        };
  
        try {
          const response = await this.getCreditLineClients(request);
          const result = isGetClientByFilterActive ? (response?.data || []) : [];
          resolve(result.length ? result : [{ client_code: "No se encuentra remitente" }]);
        } catch (error) {
          console.error('Error en búsqueda:', error);
          reject(error);
        }
      }, 350);
    });
  }

   async getCreditLineClients(request: any) {
    try {
      return await this._getClient.executeGetCreditLineClients(request);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private readonly formRules: Partial<Record<RuleKey, FormRule>> = {
    [`${BillingCutEmpresa.SIL}-${BillingCutUnidad.ALMACEN}`]: (form, fieldName) => {
      form.get(fieldName)?.disable(); 
    }
  };

  aplicarRegla(companyId: BillingCutEmpresa, unitId: BillingCutUnidad, form: FormGroup, fieldName: string): void {
    const ruleKey = `${Number(companyId)}-${Number(unitId)}` as RuleKey;
    const rule = this.formRules[ruleKey];

    if (rule) {
      rule(form, fieldName);
    } else {
      form.get(fieldName)?.enable();
      console.warn(`No hay regla para la combinación ${ruleKey}`);
    }
  }

  aplicarCutDetailValidacion(companyId: number, formGroup: FormGroup): void {
    const unitId = formGroup.get('id_business_unit')?.value;

    // Siempre obligatorios
    formGroup.get('id_business_unit')?.setValidators([Validators.required]);
    formGroup.get('id_court')?.setValidators([Validators.required]);

    // Condición dinámica para id_product
    if (companyId === BillingCutEmpresa.SIL && unitId === BillingCutUnidad.ALMACEN) {
      formGroup.get('id_product')?.clearValidators(); // No obligatorio
    } else {
      formGroup.get('id_product')?.setValidators([Validators.required]); // Obligatorio
    }

    // Actualizar estado de validación
    formGroup.get('id_business_unit')?.updateValueAndValidity();
    formGroup.get('id_court')?.updateValueAndValidity();
    formGroup.get('id_product')?.updateValueAndValidity();
  }

  async loadParameterList(code: string): Promise<ParameterModel[]> {
      try {
          const response: ResponseData<ParameterModel[]> = await this._getAllParameters.execute(code);
          return response.data;
      } catch (error) {
          console.error(`Error al cargar la lista de parámetros para el código ${code}:`, error);
          return [];
      }
  }

  public readonly CreditLineCssClass: Record<CreditLineStatus, string> = {
      [CreditLineStatus.Activo]: 'component-active',
      [CreditLineStatus.Bloqueado]: 'component-locked',
      [CreditLineStatus.BloqueadoPorDeuda]: 'component-locked',
      [CreditLineStatus.Sobregirado]: 'component-overdrawn',
      [CreditLineStatus.Contado]: 'component-counted',
      [CreditLineStatus.BloqueoOperativo]: 'component-locked',
      [CreditLineStatus.Ilimitado]: 'component-active',
  };
}


