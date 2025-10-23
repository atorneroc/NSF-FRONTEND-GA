import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from "src/app/common/shared/services/alert.service";
import { ValidateInputService } from "src/app/common/shared/services/validate-input.service";
import { ParameterModel } from "src/app/core/models/parameter.model";
import { ResponseData } from "src/app/core/models/response.model";
import { AllOperationalDetailResponse } from "src/app/core/models/settlement/responses/all-operational-detail.response";
import { GetAllOperationalDetailUseCase } from "src/app/core/usecase/operational-detail/get-all-operational-detail.usecase";
import { GetParameterByIdUseCase } from "src/app/core/usecase/utils/get-parameter-by-id.usecase";
import { customValidator, phoneValidator, rucValidator,tariffValidator } from 'src/app/common/validator/validator';
@Component({
    selector: 'app-register-operational-detail',
    templateUrl: './register-operational-detail.component.html',
    styleUrls: ['./register-operational-detail.component.scss'],
})

export class RegisterOperationalDetailComponent implements OnInit {

    formOperationalDetail: FormGroup

    lGrouperOperationalDetail: ParameterModel[] = []
    lOperationDetail: AllOperationalDetailResponse[] = []
    lUnitMeasure: ParameterModel[] = []
    lCurrencyType: ParameterModel[] = []

    typeCurrency: string = "PEN"
    isDollarSelected = false;
    maxLengthQuantity:number=8;
    constructor(
        public ref: DynamicDialogRef,
        public validateService: ValidateInputService,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _getAllOperationalDetails: GetAllOperationalDetailUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _config: DynamicDialogConfig,
    ) { }

    ngOnInit() {

        this.createFormOperationalDetail()
        this.getAllOperationalDetails(this._config.data)
        this.getAllGrouperOperationalDetail()
        this.getAllUnitMeasure()
    }

    createFormOperationalDetail() {
        this.formOperationalDetail = this._formBuilder.group({
            operational_detail: [null, Validators.required],
            grouper: [null],
            unit_measure: [null, Validators.required],
            tariff: [null, [tariffValidator(),Validators.required]],
            quantity: [null, [tariffValidator(),Validators.required]],
            subtotal_price: [null]
        })
    }

    async getAllOperationalDetails(filter: any) {

        try {
            const response: ResponseData<AllOperationalDetailResponse[]> = await this._getAllOperationalDetails.execute(filter)
            this.lOperationDetail = response.data
            this.isDollarSelected=filter.isDollarSelected
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

    calculateSubtotalPrice(event: any) {

        const form = this.formOperationalDetail.value
        const subtotalPrice = form.tariff * event.value

        this.formOperationalDetail.get('subtotal_price').setValue(subtotalPrice)
    }
    calculateSubtotalPriceForTarif(tariff: any) {

        const form = this.formOperationalDetail.value
        const subtotalPrice = tariff * form.quantity

        this.formOperationalDetail.get('subtotal_price').setValue(subtotalPrice)
    }

    registerOperationalDetail() {
        const form = this.formOperationalDetail.value
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
        if (this.formOperationalDetail.invalid) {
            this.formOperationalDetail.markAllAsTouched()
            this._alertService.warn("Completar los datos necesarios")
            return
        }

        const body: any = {
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

    onChangeDetailOp()
    {
      try {

        const form = this.formOperationalDetail.value
        const idDetail=form.operational_detail
        const idUnit=this.lOperationDetail.find(f => f.id=== idDetail).id_unit_measure

        if (idUnit>0) {
          this.formOperationalDetail.get('unit_measure').setValue(idUnit)
        }else
        {
          this.formOperationalDetail.get('unit_measure').reset()
        }

      } catch (error) {

      }
    }
}
