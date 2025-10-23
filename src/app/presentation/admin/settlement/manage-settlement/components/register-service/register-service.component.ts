import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators ,ValidatorFn, AbstractControl} from "@angular/forms";
import { DynamicDialogRef,DynamicDialogConfig } from "primeng/dynamicdialog";
import { AlertService } from "src/app/common/shared/services/alert.service";
import { ValidateInputService } from "src/app/common/shared/services/validate-input.service";
import { ResponseData } from "src/app/core/models/common/response/response.model";
import { ParameterModel } from "src/app/core/models/parameter.model";
import { RateDetailSearch ,RateServiceSearch} from "src/app/core/models/liquidation.model";
import { AllOperationalDetailResponse } from "src/app/core/models/settlement/responses/all-operational-detail.response";
import { AllServiceResponse } from "src/app/core/models/settlement/responses/all-service.response";
import { GetAllOperationalDetailUseCase } from "src/app/core/usecase/operational-detail/get-all-operational-detail.usecase";
import { GetAllServicesUseCase } from "src/app/core/usecase/service/get-all-services.usecase";
import { GetParameterByIdUseCase } from "src/app/core/usecase/utils/get-parameter-by-id.usecase";
import { GetStoreById } from "src/app/core/usecase/utils/get-store-by-id.usecase";
import { GetStoreByCompanyBranchOfficeUnitResponse } from "src/app/core/models/utils/responses/get-store-by-company-branchOffice-businessUnit";
import { customValidator, phoneValidator, rucValidator,tariffValidator } from 'src/app/common/validator/validator';
@Component({
    selector: 'app-register-service',
    templateUrl: './register-service.component.html',
    styleUrls: ['./register-service.component.scss'],
})

export class RegisterServiceComponent implements OnInit {

    formService: FormGroup

    lAccountingService: AllServiceResponse[] = []
    lGrouperOperationalDetail: ParameterModel[] = []
    lOperationDetail: AllOperationalDetailResponse[] = []
    lUnitMeasure: ParameterModel[] = []
    typeCurrency: string = "PEN"
    isDollarSelected = false;
    storeList: ParameterModel[] = [];
    maxLengthQuantity:number=8;
    constructor(
        public ref: DynamicDialogRef,
        public validateService: ValidateInputService,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _getAllServices: GetAllServicesUseCase,
        private _getAllOperationalDetails: GetAllOperationalDetailUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _config: DynamicDialogConfig,
        private _getStoreByUnitId: GetStoreById,
    ) { }

    ngOnInit() {

      console.log('DATA ENVIADA DE REGISTRAR LIQUIDAVCION', this._config.data)
        this.createFormService()
        this.getStoreByUnitId(this._config.data)
        this.getAllGrouperOperationalDetail()
        this.getAllUnitMeasure()
    }

    createFormService() {
        this.formService = this._formBuilder.group({
            store: [null, Validators.required],
            accounting_service: [null, Validators.required],
            grouper: [null],
            operational_detail: [null, Validators.required],
            unit_measure: [null, Validators.required],
            tariff: [null, [tariffValidator(),Validators.required]],
            quantity: [null,[tariffValidator(),Validators.required] ],
            subtotal_price: [null]
        })
    }
    get tariff() {
      return this.formService.get('tariff');
    }

    //tariffValidator(): ValidatorFn {
    //  return (control: AbstractControl): { [key: string]: any } | null => {
    //    const patternn = /^\d{0,8}(\.\d{0,3})?$/;
    //    if (!patternn.test(control.value)) {
    //      return { 'patternn': 'El formato del campo es incorrecto.' };
     //   }
    //    return null;
    //  };
    //}

    async getStoreByUnitId(filter:any) {
      try {
          const params: GetStoreByCompanyBranchOfficeUnitResponse={
                                            idCompany: filter.company_id,
                                            idBranchOffice: filter.branch_office_id,
                                            idBusinessUnit: filter.business_unit_id}
          const response: ResponseData<ParameterModel[]> = await this._getStoreByUnitId.execute(params)
          this.storeList = response.data;
          this.isDollarSelected=filter.isDollarSelected
      } catch (error) {
          console.log('Error: ', error);
      }
    }

    onChangeStore() {
      this.formService.get('accounting_service').reset();
      this.formService.get('grouper').reset();
      this.formService.get('unit_measure').reset();
      this.formService.get('operational_detail').reset();
      this.lAccountingService = [];
      this.lOperationDetail=[];
      const idService = this.formService.get('store').value
      const [idBase] = this.storeList.filter(value => value.id == idService)
      let lsIdService:number[]=[0];

      lsIdService= this._config.data.lstIdServicesAdded

      this.getAllServices(idBase.id_estructura_base,lsIdService);
    }

    async getAllServices(idBase: number,lsIdService: number[]) {

      try {
        const filter :RateServiceSearch={
          idBaseStructure:idBase,
          lstIdServicesAdded:lsIdService
        }

          const response: ResponseData<AllServiceResponse[]> = await this._getAllServices.execute(filter)
          this.lAccountingService = response.data
      }
      catch (error) {
          console.log("Error: ", error)
      }
    }

    onChangeService() {
      this.formService.get('grouper').reset();
      this.formService.get('unit_measure').reset();
      this.formService.get('operational_detail').reset();
      this.lOperationDetail = [];
      const [idServiceStructure] = this.lAccountingService.filter(value => value.id == this.formService.get('accounting_service').value)
      this.getAllOperationalDetails(idServiceStructure.id_service_organizational_structure);
    }



    async getAllOperationalDetails(idServiceStructure:number) {
        try {
            const params: RateDetailSearch = {
              idService: idServiceStructure,
              lst:this._config.data.lstIdDetailOperational
            };
            const response: ResponseData<AllOperationalDetailResponse[]> = await this._getAllOperationalDetails.execute(params)
            this.lOperationDetail = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllGrouperOperationalDetail() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("AGRPDO")
            this.lGrouperOperationalDetail = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllUnitMeasure() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("17")
            this.lUnitMeasure = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    calculateSubtotalPriceForTarif(tariff: any) {

      const form = this.formService.value
        const subtotalPrice = tariff * form.quantity

        this.formService.get('subtotal_price').setValue(subtotalPrice)
    }
    calculateSubtotalPrice(event: any) {

        const form = this.formService.value
        const subtotalPrice = form.tariff * event.value
        this.formService.get('subtotal_price').setValue(subtotalPrice)
    }


    registerService() {
        const form = this.formService.value
        const length = form.subtotal_price ==null ? 0 : form.subtotal_price;
        if (length.toString().split('.')[0].length>8) {
            this._alertService.warn('Excediste el máximo valor permitido');
            return;
        }
        if (form.quantity == 0) {
          this._alertService.warn('La cantidad minima es 1');
          return;
        }
        if (!(form.tariff>0)) {
          this._alertService.warn('La tarifa debe ser mayor a 0');
          return;
        }
        if (this.formService.invalid) {
            this.formService.markAllAsTouched()
            this._alertService.warn("Completar los datos necesarios")
            return
        }

        const body: any = {

            accounting_service: form.accounting_service,
            service_description: this.lAccountingService.find(option => option.id === form.accounting_service)?.description,
            product_description: this.storeList.find(option => option.id === form.store)?.name,
            grouper: form.grouper,
            grouper_description: this.lGrouperOperationalDetail.find(option => option.id === form.grouper)?.description,
            operational_detail: form.operational_detail,
            operational_detail_description: this.lOperationDetail.find(option => option.id === form.operational_detail)?.description,
            unit_measure: form.unit_measure,
            unit_measure_description: this.lUnitMeasure.find(option => option.id === form.unit_measure)?.description,

            tariff: form.tariff,
            quantity: form.quantity,
            subtotal_price: form.subtotal_price,
            id_detail_operational_organizational_structure:this.lOperationDetail.find(option => option.id === form.operational_detail)?.id_detail_operational_organizational_structure,
            id_service_organizational_structure:this.lOperationDetail.find(option => option.id === form.operational_detail)?.id_service_organizational_structure
        }

        this.ref.close(body)
    }

    onChangeDetail()
    {
      try {

        const form = this.formService.value
        const idDetail=form.operational_detail
        const idUnit=this.lOperationDetail.find(f => f.id=== idDetail).id_unit_measure
        if (idUnit>0) {
          this.formService.get('unit_measure').setValue(idUnit)
        }else
        {
          this.formService.get('unit_measure').reset()
        }

      } catch (error) {

      }
    }

}
