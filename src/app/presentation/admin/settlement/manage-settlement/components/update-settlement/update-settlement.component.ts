import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { setDateFormat } from "src/app/common/validator/date";
import { RateRangeSearch, RateDetailSearch, RateCreateServiceSearch } from "src/app/core/models/liquidation.model";
import { GetLiquidationByIdUsecase } from "src/app/core/usecase/settlement/get-liquidation-by-id.usecase";
import { UpdateLiquidationUsecase } from "src/app/core/usecase/settlement/update-liquidation.usecase";
import { ExchangeRateModel } from "src/app/core/models/exchange-rate.model";
import { Router, ActivatedRoute } from "@angular/router";
import { LoaderService } from "src/app/common/shared/components/loader/loader.service";
import { ValidateInputService } from "src/app/common/shared/services/validate-input.service";
import { AlertService } from "src/app/common/shared/services/alert.service";
import { invalid } from "src/app/common/helpers/constants/alert.constants";
import { AddCommentComponent } from "./components/add-comment/add-comment.component";
import { UpdateDetailComponent } from "./components/update-detail/update-detail.component";
import { DialogService } from "primeng/dynamicdialog";
import saveAs from 'save-as';
import { GetRatesRangeUseCase } from "src/app/core/usecase/settlement/get-rates-range.usecase";
import { ServiceRateRangeModel } from "src/app/core/models/rate.model";
import { DownloadFileUseCase } from '../../../../../../core/usecase/utils/download-file.usecase';
import { ResponseData } from "src/app/core/models/common/response/response.model";
import { ParameterModel } from "src/app/core/models/parameter.model";
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { RegisterOperationalDetailComponent } from "../register-operational-detail/register-operational-detail.component";
import { ConfirmationService, MenuItem } from 'primeng/api';
import { RegisterServiceComponent } from "../register-service/register-service.component";
import { tariffValidator } from 'src/app/common/validator/validator';
import { SharedDataUrlService } from "src/app/common/shared/services/shared-data-url.service";
import { RateType } from 'src/app/common/helpers/constants/rate_type.constants'
import { InputNumber } from "primeng/inputnumber";
@Component({
    selector: 'app-update-settlement',
    templateUrl: './update-settlement.component.html',
    styleUrls: ['./update-settlement.component.scss'],
})

export class UpdateSettlementComponent implements OnInit {

    minFinishDate: Date;
    list: any[] = [];
    id: number;
    isDollarSelected = false;
    isDisabledRegister=true;
    idLiquidation: number;
    liquidation: any
    selectedCategory = 1;
    mensaje: string;
    exchangeRate: ExchangeRateModel;
    formBodySettlement: FormGroup;
    // Form de actualización de liquidación
    formUpdateSettlement: FormGroup;
    storeList: ParameterModel[] = [];
    coins: ParameterModel[] = [];
    lrateType: ParameterModel[] = [];
    bank_purchase: 0;
    lStatus: ParameterModel[] = [];
    maxLengthQuantity:number=8;
    debounce: any;
    typeRate: any = RateType

    constructor(
        public validateService: ValidateInputService,
        private _formBuilder: FormBuilder,
        public loaderService: LoaderService,
        public dialogService: DialogService,
        private _alertService: AlertService,
        private _getLiquidationById: GetLiquidationByIdUsecase,
        private _updateLiquidation: UpdateLiquidationUsecase,
        private _downloadFile: DownloadFileUseCase,
        private _router: Router,
        private _route: ActivatedRoute,
        private _getRatesRange: GetRatesRangeUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllStatus: GetParameterByIdUseCase,
        private _confirmationService: ConfirmationService,
        private _sharedDataService: SharedDataUrlService
    ) { }

    ngOnInit() {
        this.createFormBodySettlement();

        this.getAllCoins().then(() => {
            this._route.params.subscribe(params => {
                this.idLiquidation = params['id']
                this.getLiquidationById(this.idLiquidation).then(() => {
                    this.changeValueDollarSelected(this.isDollarSelected)
                });
            })
        });
        this.getAllStatus();
        this.actualizarBreadcrumbItems()
        this.getRateType()
    }
    actualizarBreadcrumbItems() {
      const newItems: MenuItem[] = [
        { label: 'Inicio' },
        { label: 'Liquidación', routerLink:'settlement/' },
        { label: 'Actualizar Liquidación' }
      ];
      this._sharedDataService.setBreadcrumbItems(newItems);
    }
    async getAllStatus() {

        try {
            const STATUS_ID = '12';
            const response: ResponseData<ParameterModel[]> = await this._getAllStatus.execute(STATUS_ID);
            this.lStatus = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    createFormBodySettlement() {
        this.formBodySettlement = this._formBuilder.group({
            service_start_date: [null, Validators.required],
            service_finish_date: [null, Validators.required],
            total_price: [null],
            client_id: [null],
            type_currency: [null],
            total_Amount_Liquidation_Foreign_Currency: [null],
            total_Amount_Liquidation_National_Currency: [null],
            id_Liquidation: [null],
            exchange_Rate_Value: [null],
            rates_detail: this._formBuilder.array([]),
            rates_detail_bd: this._formBuilder.array([]),
            id_company: [null],
            id_branch_office: [null],
            id_business_unit: [null],
            id_store: [null],
            type_currency_selected: [null],
        });
    }

    async getLiquidationById(idLiquidation: number) {
        try {
            const response: ResponseData<any> = await this._getLiquidationById.execute(idLiquidation);
            this.liquidation = response.data
            this.generateLiquidationDetailForms(response)
            this.mensaje = response.message;
        } catch (error) {
            console.log('Error: ', error);
            this.mensaje = '';
        }
    }
    async getRateType() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("24")
            this.lrateType = response.data

        }
        catch (error) {
            console.log("Error: ", error)
        }
    }
    async getAllCoins() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("1")
            this.coins = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    get rates_detail() {
        return this.formBodySettlement.controls['rates_detail'] as FormArray;
    }

    get rates_detail_bd() {
        return this.formBodySettlement.controls['rates_detail_bd'] as FormArray;
    }

    generateLiquidationDetailForms(response: any) {
        this.calcMinFinishDate(response.data.service_Start_Date)

        this.formBodySettlement.patchValue({
            service_start_date: new Date(response.data.service_start_date),
            service_finish_date: new Date(response.data.service_finish_date),
            total_price: response.data.total_amount_liquidation,
            total_Amount_Liquidation_Foreign_Currency: response.data.total_amount_liquidation_foreign_currency,
            total_Amount_Liquidation_National_Currency: response.data.total_Amount_liquidation_foreign_currency,
            id_Liquidation: response.data.id_liquidation,
            type_currency: response.data.type_currency_parameter,
            code_type_rate: response.code_type_rate,
            exchange_Rate_Value: response.data.exchange_rate_value,
            client_id: response.data.id_client,
            id_company: response.data.id_company,
            id_branch_office: response.data.id_branch_office,
            id_business_unit: response.data.id_business_unit,
            id_store: response.data.id_store,
            type_currency_selected: 1,
        })

        const [typeCurrency] = this.coins.filter(value => value.id == response.data.type_currency_parameter)

        this.bank_purchase = response.data.exchange_rate_value;

        if (typeCurrency.detail_code == "2") {
            this.isDollarSelected = true;
            this.formBodySettlement.get('type_currency_selected').setValue(2);
        }

        this.addRatesToList(response.data.liquidation_detail);
        this.addRatesBdToList(response.data.liquidation_detail);
    }
    addRatesToList(liquidation_detail: any) {
        liquidation_detail.forEach((service) => {
            service.lstliquidationdetailgroup.forEach((group) => {
                group.lstliquidationdetails.forEach((rate) => {
                    const form = this._formBuilder.group({
                        id: [rate.id_detalle_operativo],
                        quantity: [rate.quantity ?? 0, [tariffValidator()]],
                        total_price: [rate.total_amount_operational_detail],
                        operational_detail_price: [rate.operational_detail_price, [tariffValidator()]],
                        description: [rate.servicio_descripcion],
                        operational_detail_price_Temp: [rate.operational_detail_price],
                        rate_val: [rate.operational_detail_price],
                        id_detail_operational: [rate.id_detail_operational],
                        operational_detail_description: [rate.operational_detail_description],
                        id_liquidation_detail_service: [rate.id_liquidation_detail_service],
                        id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                        id_service: [rate.id_service],
                        id_service_organizational_structure: [rate.id_service_organizational_structure],
                        id_unit_measure: [rate.id_unit_measure],
                        rate_type_parameter: [rate.rate_type_parameter],
                        code_type_rate: [rate.code_type_rate],
                        service_description: [rate.service_description],
                        unit_measure_description: [rate.unit_measure_description],
                        igv: [true],
                        files: [null],
                        filesBlob: [rate.files],
                        id_rate: [rate.id_rate],
                        file_description: [rate.file_description],
                        delete_file:0,
                        file_extension: [rate.file_extension],
                        id_group: [rate.id_group]
                    });
                    this.rates_detail.push(form);
                    rate.formIndex = this.rates_detail.length - 1;
                })
            });
        });
    }

    addRatesBdToList(services: any) {
        services.forEach((service) => {
            service.lstliquidationdetailgroup.forEach((group) => {
                group.lstliquidationdetails.forEach((rate) => {
                    const form = this._formBuilder.group({
                        id: [rate.id_detalle_operativo],
                        quantity: [rate.quantity, [tariffValidator()]],
                        total_price: [rate.total_amount_operational_detail],
                        operational_detail_price: [rate.operational_detail_price],
                        description: [rate.servicio_descripcion],
                        operational_detail_price_Temp: [rate.operational_detail_price],
                        rate_val: [rate.operational_detail_price],
                        id_detail_operational: [rate.id_detail_operational],
                        operational_detail_description: [rate.operational_detail_description],
                        id_liquidation_detail_service: [rate.id_liquidation_detail_service],
                        id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                        id_service: [rate.id_service],
                        id_service_organizational_structure: [rate.id_service_organizational_structure],
                        id_unit_measure: [rate.id_unit_measure],
                        rate_type_parameter: [rate.rate_type_parameter],
                        code_type_rate: [rate.code_type_rate],
                        service_description: [rate.service_description],
                        unit_measure_description: [rate.unit_measure_description],
                        igv: [true],
                        files: [null],
                        filesBlob: [rate.files],
                        id_rate: [rate.id_rate],
                        file_description: [rate.file_description],
                        delete_file:0,
                        file_extension: [rate.file_extension],
                        id_group: [rate.id_group]
                    });
                    this.rates_detail_bd.push(form);
                    //this.rates_detail_bd.push(form);
                    rate.formIndex = this.rates_detail_bd.length - 1;
                })
            });
        });
    }
    deleteGroup(nameGroup: string| undefined, serviceIndex: number, groupIndex: number, rateIndex: number, rateIndex2: number){

        try {
            this._confirmationService.confirm({
                message: `¿Estas seguro de eliminar el grupo ${nameGroup==undefined ? "":nameGroup} ?`,
                accept: async () => {
                  let index = 0;
                  this.liquidation.liquidation_detail.forEach((service) => {
                      service.lstliquidationdetailgroup.forEach((group) => {
                          group.lstliquidationdetails.forEach((rate) => {

                              const valueRate = this.rates_detail.controls[index].value;
                              rate.quantity = valueRate.quantity;
                              rate.operational_detail_price = valueRate.operational_detail_price;
                              rate.total_amount_operational_detail = rate.quantity * rate.operational_detail_price;

                              index += 1;
                          })
                      });
                  });
                  this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup[groupIndex].lstliquidationdetails.splice(0)
                  this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup.splice(groupIndex,1)


                  //const cantlstdetails = this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup[groupIndex].lstliquidationdetails.length;
                  //if (cantlstdetails == 0) this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup.splice(groupIndex, 1)

                  const cantlstgroups = this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup.length;
                  if (cantlstgroups == 0) this.liquidation.liquidation_detail.splice(serviceIndex, 1)

                  this.clearFormArray(this.rates_detail);
                  this.addRatesToList(this.liquidation.liquidation_detail);
                  //this.rates_detail.removeAt(rateIndex2)
                  this.getTotalPrice();
                },
                reject: async () => {
                    this._alertService.warn('Se cancelo la accion.')
                }
            })
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateLiquidation(index: number, saveType: string) {

        try {
            const length=this.formBodySettlement.get('total_price').value==null?0:this.formBodySettlement.get('total_price').value;
            if (length.toString().split('.')[0].length>8) {
                this._alertService.warn('Excediste el máximo valor permitido');
                return;
            }
            if (this.formBodySettlement.invalid) {
              this._alertService.warn(invalid);
              this.formBodySettlement.markAllAsTouched();
              return;
            }

            const formDetail = this.formBodySettlement.value;

            let total_Amount_Liquidation_Foreign_Currency = 0;
            let total_Amount_Liquidation_National_Currency = 0;

            if (this.isDollarSelected) {
                total_Amount_Liquidation_Foreign_Currency = this.formBodySettlement.get('total_price').value || 0;
                total_Amount_Liquidation_National_Currency = this.formBodySettlement.get('total_price').value * this.bank_purchase || 0;
            }
            else {
                total_Amount_Liquidation_Foreign_Currency = this.formBodySettlement.get('total_price').value / this.bank_purchase || 0;
                total_Amount_Liquidation_National_Currency = this.formBodySettlement.get('total_price').value || 0;
            }

            const [typeSaveLiquidation] = this.lStatus.filter(data => data.detail_code === saveType)

            const liquidation: any = {
                id_Liquidation: formDetail.id_Liquidation,
                service_Start_Date: setDateFormat(formDetail.service_start_date),
                service_Finish_Date: setDateFormat(formDetail.service_finish_date),
                total_Amount_Liquidation: this.formBodySettlement.get('total_price').value,
                total_Amount_Liquidation_Foreign_Currency: total_Amount_Liquidation_Foreign_Currency,
                total_Amount_Liquidation_National_Currency: total_Amount_Liquidation_National_Currency,
                status_Parameter: typeSaveLiquidation.id,
                user: localStorage.getItem('username'),
                liquidation_Detail_Operational: [],
                liquidation_Detail_Operational_bd: [],
            };
            let filteredControls;
            if (saveType=="SL03") {
                filteredControls = this.rates_detail.controls.filter(control => (control.get('quantity').value >0));
            } else {
                filteredControls = this.rates_detail.controls
            }
            if (filteredControls.length == 0) {
                this._alertService.warn('No se tiene ningún servicio y/o detalle operativo añadido')
                return
            }
            for (const form of filteredControls) {
                let total_Amount_Operational_Detail_Foreign_Currency = 0;
                let total_Amount_Operational_Detail_National_Currency = 0;
                if (this.isDollarSelected) {
                    total_Amount_Operational_Detail_Foreign_Currency = form.get('total_price').value || 0;
                    total_Amount_Operational_Detail_National_Currency = form.get('total_price').value * this.bank_purchase || 0;
                }
                else {
                    total_Amount_Operational_Detail_Foreign_Currency = form.get('total_price').value / this.bank_purchase || 0;
                    total_Amount_Operational_Detail_National_Currency = form.get('total_price').value || 0;
                }


                liquidation.liquidation_Detail_Operational.push({
                    id_Detail_Operational: form.get('id_detail_operational').value || 0,
                    id_Liquidation_Detail_Service: form.get('id_liquidation_detail_service').value || 0,
                    quantity: form.get('quantity').value || 0,
                    unit_Amount_Operational_Detail: form.get('operational_detail_price').value || 0,
                    total_Amount_Operational_Detail: form.get('total_price').value || 0,
                    total_Amount_Operational_Detail_Foreign_Currency,
                    total_Amount_Operational_Detail_National_Currency,
                    file_Description: form.get('file_description').value,
                    delete_file: form.get('delete_file').value,
                    id_detail_operational_organizational_structure: form.get('id_detail_operational_organizational_structure').value || 0,
                    id_service_organizational_structure: form.get('id_service_organizational_structure').value || 0,
                    id_group: form.get('id_group').value || 0,
                    rate_Type_Parameter: form.get('rate_type_parameter').value,
                    user: localStorage.getItem('username'),
                    id_unit_measure: form.get('id_unit_measure').value || 0,
                    files: await Promise.all((form.get("files").value || []).map(async (file) => await this.getBase64(file)))
                });
            }

            for (const form of this.rates_detail_bd.controls) {
                let total_Amount_Operational_Detail = 0;
                let total_Amount_Operational_Detail_Foreign_Currency = 0;
                let total_Amount_Operational_Detail_National_Currency = 0;
                if (this.isDollarSelected) {

                    total_Amount_Operational_Detail = form.get('total_price').value / this.bank_purchase || 0;
                    total_Amount_Operational_Detail_Foreign_Currency = form.get('total_price').value / this.bank_purchase || 0;
                    total_Amount_Operational_Detail_National_Currency = form.get('total_price').value || 0;
                }
                else {
                    total_Amount_Operational_Detail = form.get('total_price').value || 0;
                    total_Amount_Operational_Detail_Foreign_Currency = form.get('total_price').value / this.bank_purchase || 0;
                    total_Amount_Operational_Detail_National_Currency = form.get('total_price').value || 0;
                }

                liquidation.liquidation_Detail_Operational_bd.push({
                    id_Detail_Operational: form.get('id_detail_operational').value || 0,
                    id_Liquidation_Detail_Service: form.get('id_liquidation_detail_service').value || 0,
                    quantity: form.get('quantity').value || 0,
                    unit_Amount_Operational_Detail: form.get('operational_detail_price').value || 0,
                    total_Amount_Operational_Detail,
                    total_Amount_Operational_Detail_Foreign_Currency,
                    total_Amount_Operational_Detail_National_Currency,
                    file_Description: form.get('file_description').value,
                    id_detail_operational_organizational_structure: form.get('id_detail_operational_organizational_structure').value || 0,
                    id_service_organizational_structure: form.get('id_service_organizational_structure').value || 0,
                    id_group: form.get('id_group').value || 0,
                    rate_Type_Parameter: form.get('rate_type_parameter').value,
                    user: localStorage.getItem('username'),
                    id_unit_measure: form.get('id_unit_measure').value || 0,
                    files: await Promise.all((form.get("files").value || []).map(async (file) => await this.getBase64(file)))
                });
            }

            const data: any = await this._updateLiquidation.execute(liquidation);

            this._alertService.success(data.message || 'Actualizado correctamente');
            this._router.navigate(['admin/settlement']);
        }

        catch (error) {
            console.log(error);
        }
    }

    registerOperationalDetail(service: any) {
        const form = this.formBodySettlement.get('client_id').value;
        let numeros: number[] = [];

        service.lstliquidationdetailgroup.forEach((group) => {
            group.lstliquidationdetails.forEach((rate) => {
                numeros.push(rate.id_detail_operational_organizational_structure)
            })
        });

        const params: RateDetailSearch = {
            idService: service.id_service_organizational_structure || 0,
            lst: numeros,
            isDollarSelected: this.isDollarSelected
        };

        const ref = this.dialogService.open(RegisterOperationalDetailComponent, {
            data: params,
            header: 'Crear detalle operativo',
            width: '65rem',
        });

        ref.onClose.subscribe((operationaldetail) => {

            const index_service = this.liquidation.liquidation_detail.findIndex(
                (res) => res.id_service_organizational_structure === service.id_service_organizational_structure
            )

            const body: any = {
                id_group: operationaldetail.grouper,
                group_name: operationaldetail.grouper_description,
                isOpen: false,
                lstliquidationdetails: [{
                    id_detail_operational: 0,
                    operational_detail_description: operationaldetail.operational_detail_description,
                    unit_measure_description: operationaldetail.unit_measure_description,
                    operational_detail_price: operationaldetail.tariff,
                    id_unit_measure: operationaldetail.unit_measure,
                    quantity: operationaldetail.quantity,
                    id_detail_operational_organizational_structure: operationaldetail.id_detail_operational_organizational_structure,
                    id_service_organizational_structure: operationaldetail.id_service_organizational_structure,
                    rate_type_parameter: this.lrateType.find(f => f.detail_code===this.typeRate.EDITABLE).id,// 223,
                    code_type_rate: this.typeRate.EDITABLE,// 223,
                    id_liquidation_detail_service: service.id_liquidation_detail_service || 0,
                    total_price: operationaldetail.subtotal_price,
                    file_description: '',
                    delete_file:0,
                    file_extension: '',
                    file_id: 0,
                    id_rate: 0,
                    id_service: service.id_service,
                    files: null,
                    id_group: operationaldetail.grouper
                }]
            }

            this.addOperationalDetail(body)

            const index_group = this.liquidation.liquidation_detail[index_service].lstliquidationdetailgroup.findIndex(
                (res) => res.id_group === body.id_group
            )

            if (index_group >= 0) {
                this.liquidation.liquidation_detail[index_service].lstliquidationdetailgroup[index_group].lstliquidationdetails.push(body.lstliquidationdetails.shift())
            } else {
                this.liquidation.liquidation_detail[index_service].lstliquidationdetailgroup.push(body)
            }


        })
    }

    deleteOperationalDetail(serviceIndex: number, groupIndex: number, rateIndex: number, rateIndex2: number) {
        try {
            this._confirmationService.confirm({
                message: `¿Estas seguro de eliminar el detalle operativo?`,
                accept: async () => {

                    let index = 0;
                    this.liquidation.liquidation_detail.forEach((service) => {
                        service.lstliquidationdetailgroup.forEach((group) => {
                            group.lstliquidationdetails.forEach((rate) => {

                                const valueRate = this.rates_detail.controls[index].value;
                                rate.quantity = valueRate.quantity;
                                rate.operational_detail_price = valueRate.operational_detail_price;
                                rate.total_amount_operational_detail = rate.quantity * rate.operational_detail_price;

                                index += 1;
                            })
                        });
                    });
                    this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup[groupIndex].lstliquidationdetails.splice(rateIndex, 1)
                    //this.list[serviceIndex].lstgroups[groupIndex].lstdetails.splice(rateIndex,1)

                    const cantlstdetails = this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup[groupIndex].lstliquidationdetails.length;
                    if (cantlstdetails == 0) this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup.splice(groupIndex, 1)

                    const cantlstgroups = this.liquidation.liquidation_detail[serviceIndex].lstliquidationdetailgroup.length;
                    if (cantlstgroups == 0) this.liquidation.liquidation_detail.splice(serviceIndex, 1)

                    this.clearFormArray(this.rates_detail);
                    this.addRatesToList(this.liquidation.liquidation_detail);
                    //this.rates_detail.removeAt(rateIndex2)
                    this.getTotalPrice();
                },
                reject: async () => {
                    this._alertService.warn('Se cancelo la accion.')
                }
            })
        }
        catch (error) {
            console.log(error);
        }
    }
    clearFormArray(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }
    addOperationalDetail(operationalDetail: any) {
        operationalDetail.lstliquidationdetails.forEach((rate) => {
            const form = this._formBuilder.group({
                id: [rate.id_detail_operational],
                id_detail_operational: [rate.id_detail_operational],
                quantity: [rate.quantity, [tariffValidator()]],
                total_price: [rate.total_price],
                operational_detail_price: [rate.operational_detail_price, [tariffValidator()]],
                description: [rate.operational_detail_description],
                operational_detail_price_Temp: [rate.operational_detail_price],
                rate_val: [null],
                operational_detail_description: [rate.operational_detail_description],
                id_liquidation_detail_service: [rate.id_liquidation_detail_service],
                id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                id_service: [rate.id_service],
                id_service_organizational_structure: [rate.id_service_organizational_structure],
                id_unit_measure: [rate.id_unit_measure],
                rate_type_parameter: [rate.rate_type_parameter],
                code_type_rate: [rate.code_type_rate],
                service_description: '',
                unit_measure_description: [rate.unit_measure_description],
                igv: [true],
                counterFiles: [null],
                files: [null],
                filesBlob: '',
                id_rate: 0,
                file_description: '',
                delete_file:0,
                file_extension: '',
                id_group: [rate.id_group]
            });
            this.rates_detail.push(form);
            rate.formIndex = this.rates_detail.length - 1;
        });
        this.getTotalPrice();
    }

    registerService() {
        let idDetailOperationalAdded: number[] = [];
        let idServicesAdded: number[] = [];
        this.liquidation.liquidation_detail.forEach((service) => {
            idServicesAdded.push(service.id_service_organizational_structure)
            service.lstliquidationdetailgroup.forEach((group) => {
                group.lstliquidationdetails.forEach((rate) => {
                    idDetailOperationalAdded.push(rate.id_detail_operational_organizational_structure)
                })
            });
        });

        const params: RateCreateServiceSearch = {
            company_id: this.formBodySettlement.get('id_company').value || 0,
            branch_office_id: this.formBodySettlement.get('id_branch_office').value || 0,
            business_unit_id: this.formBodySettlement.get('id_business_unit').value || 0,
            isDollarSelected: this.isDollarSelected,
            lstIdDetailOperational: idDetailOperationalAdded,
            lstIdServicesAdded: idServicesAdded,
        };
        const ref = this.dialogService.open(RegisterServiceComponent, {
            data: params,
            header: 'Crear servicio',
            width: '65rem',
        });

        ref.onClose.subscribe((service) => {

            const body: any =
            {
                id_service: service.accounting_service,
                service_description: service.service_description,
                product_description: service.product_description,
                id_service_organizational_structure: service.id_service_organizational_structure,
                lstliquidationdetailgroup: [
                    {
                        id_group: service.grouper,
                        group_name: service.grouper_description,
                        isOpen: false,
                        lstliquidationdetails: [{
                            id_detail_operational: 0,
                            operational_detail_description: service.operational_detail_description,
                            unit_measure_description: service.unit_measure_description,
                            operational_detail_price: service.tariff,
                            id_unit_measure: service.unit_measure,
                            quantity: service.quantity,
                            id_detail_operational_organizational_structure: service.id_detail_operational_organizational_structure,
                            id_service_organizational_structure: service.id_service_organizational_structure,
                            rate_type_parameter: this.lrateType.find(f => f.detail_code===this.typeRate.EDITABLE).id,// 223,
                            code_type_rate: this.typeRate.EDITABLE,// 223,
                            id_liquidation_detail_service: 0,
                            total_price: service.subtotal_price,
                            file_description: '',
                            delete_file:0,
                            file_extension: '',
                            file_id: 0,
                            id_rate: 0,
                            id_service: service.id_service,
                            files: null,
                            id_group: service.grouper
                        }]
                    }
                ]
            };

            this.addRateToList(body)
            this.liquidation.liquidation_detail.push(body)
        })
    }
    addRateToList(service: any) {
        service.lstliquidationdetailgroup.forEach((group) => {
            group.lstliquidationdetails.forEach((rate) => {
                const form = this._formBuilder.group({
                    id: [rate.id_detail_operational],
                    id_detail_operational: [rate.id_detail_operational],
                    quantity: [rate.quantity, [tariffValidator()]],
                    total_price: [rate.total_price],
                    operational_detail_price: [rate.operational_detail_price, [tariffValidator()]],
                    description: [rate.operational_detail_description],
                    operational_detail_price_Temp: [rate.operational_detail_price],
                    rate_val: [null],
                    operational_detail_description: [rate.operational_detail_description],
                    id_liquidation_detail_service: 0,
                    id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                    id_service: [rate.id_service],
                    id_service_organizational_structure: [rate.id_service_organizational_structure],
                    id_unit_measure: [rate.id_unit_measure],
                    rate_type_parameter: [rate.rate_type_parameter],
                    code_type_rate: [rate.code_type_rate],
                    service_description: '',
                    unit_measure_description: [rate.unit_measure_description],
                    igv: [true],
                    counterFiles: [null],
                    files: [null],
                    filesBlob: '',
                    id_rate: 0,
                    file_description: '',
                    delete_file:0,
                    file_extension: '',
                    id_group: [rate.id_group]
                });
                this.rates_detail.push(form);
                rate.formIndex = this.rates_detail.length - 1;
            })
        });
        this.getTotalPrice();
    }
    async addFiles(event: any, index: number) {
        const form = this.rates_detail.controls[index];
        form.get("files").setValue([])
        for (const file of event.currentFiles) {
            const files = form.get("files").value
            files.push(file)
            form.get("files").setValue(files)
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve({
                    file: reader.result.toString().split(',')[1],
                    name: file.name,
                    size: file.size,
                    type: file.type,
                })
            }
            reader.onerror = error => reject(error);
        });
    }

    removeFile(event: any, index: number) {
        const form = this.rates_detail.controls[index];
        const oldFiles = form.get("files").value
        const newFiles = oldFiles.filter(file => file !== event.file)
        form.get("files").setValue(newFiles)
    }

    removeTotalFile(index: number, fileUpload) {
        const form = this.rates_detail.controls[index];

        if (form.get("files").value != null) {
            form.get("files").setValue([]);
            form.get("delete_file").setValue(1);
        }
        if (form.get("filesBlob").value != null) {
            form.get("filesBlob").setValue([]);
            form.get("delete_file").setValue(1);
        }
        fileUpload.clear()
    }

    async downloadFiles(index: number) {

        const form = this.rates_detail.controls[index];
        const files = form.get("files").value
        files.forEach(file => {
            saveAs(file, file.name)
        })
    }

    async downloadFilesBlob(index: number) {

        const form = this.rates_detail.controls[index];
        try {
            const data: any = await this._downloadFile.execute(form.get("file_description").value);
            saveAs(data, form.get("file_description").value + form.get("file_extension").value);
        }
        catch (error) {
            console.log(error);
        }
    }

    showFileExplorer(fileUpload) {
        fileUpload.advancedFileInput.nativeElement.click()
    }

    getMessageHeaderCard(index: number) {
        return 'Cuenta contable N° ' + (index + 1);
    }

    calcMinFinishDate(selectedStartDate: Date) {
        this.formBodySettlement.get('service_finish_date').reset();
        const minDate = new Date(selectedStartDate);
        this.minFinishDate = minDate;
    }
    calcSubtotalByTypeRateQuantity(value: any, formIndex: number, typeRate: number, inputNumber: InputNumber) {

        const form = this.rates_detail.controls[formIndex];

        if (typeRate == this.typeRate.NORMAL) {
            this.calcSubTotal(value.value, formIndex)
        }
        if (typeRate == this.typeRate.EDITABLE) {
            this.calcSubTotalRate(value.value, formIndex)
        }
        if (typeRate == this.typeRate.RANGO) {
            this.getRateByQuantity(value.value, formIndex, inputNumber)
        }
        this.getTotalPrice(); 
    }
    //calcula subtotal desde cantidad normal
    calcSubTotal(value: number, formIndex: number) {
        const form = this.rates_detail.controls[formIndex];
        form.get('quantity').setValue(value)
        const total = form.get('operational_detail_price').value * value;
        form.get('total_price').setValue(total);
    }
    //calcula subtotal desde cantidad tarifa editable
    calcSubTotalRate(value: number, formIndex: number) {
        const form = this.rates_detail.controls[formIndex];
        form.get('quantity').setValue(value)
        const total = form.get('operational_detail_price').value * value;
        form.get('total_price').setValue(total);
    }


    //calcular el subtotal con la cantidad por rango
    async getRateByQuantity(quantity: number, formIndex: number, inputNumber : InputNumber) {
      clearTimeout(this.debounce); // Cancelar cualquier temporizador existente

      this.debounce = setTimeout(async () => {
        const form = this.rates_detail.controls[formIndex];

        // Crear objeto de parámetros para la búsqueda de tarifas
        const params: RateRangeSearch = {
          rateId: form.get('id_rate').value,
          quantity: quantity
        };

        // Verificar si la cantidad es 0 o nula, establecer el valor original
        if (quantity === 0 || !quantity) {
          form.get('operational_detail_price').setValue(form.get('operational_detail_price_Temp').value);
        } else {

          // Realizar la búsqueda de tarifas usando el servicio _getRatesRange
          try {
            const response: ResponseData<ServiceRateRangeModel> = await this._getRatesRange.execute(params);
            const rateAmountRange = response.data.rate_amount_range;

            // Verificar si el rango de tarifas es válido antes de establecerlo
            if (rateAmountRange === null || rateAmountRange === 0 || rateAmountRange.toString().trim() === "") {
              form.get('operational_detail_price').setValue(form.get('operational_detail_price_Temp').value);
            } else {
              form.get('quantity').setValue(quantity)
              form.get('operational_detail_price').setValue(this.isDollarSelected? (rateAmountRange/this.bank_purchase) :rateAmountRange);
            }
            setTimeout(() => {
                inputNumber.input.nativeElement.focus()
            }, 0);    
          } catch (error) {
            // Manejar el error de la solicitud HTTP aquí
          }
        }

        this.calcSubTotalByQuantityRateRange(quantity, formIndex);
      }, 500);

    }

    calcSubTotalByRate(value: number, formIndex: number) {
        const form = this.rates_detail.controls[formIndex];
        form.get('operational_detail_price').setValue(value)
        const total = form.get('quantity').value * value;
        form.get('total_price').setValue(total);
        this.getTotalPrice();
    }

    getTotalPrice() {
        let total = 0;
        this.rates_detail.controls.forEach((form) => {
            total = total + form.get('total_price').value;
        });
        this.isDisabledRegister=total>0?false:true;
        this.formBodySettlement.get('total_price').setValue(total);
    }

    calcSubTotalByQuantityRateRange(value: number, formIndex: number) {
        const form = this.rates_detail.controls[formIndex];
        const total = form.get('operational_detail_price').value * value;
        form.get('total_price').setValue(total);
        this.getTotalPrice();
    }

    changeValueDollarSelected(isDollarSelected: boolean) {

        this.isDollarSelected = isDollarSelected;

        this.getTotalPrice();
    }

    ShowModalAddComment() {
        const ref = this.dialogService.open(AddCommentComponent, {
            header: 'Agregar Comentarios',
            width: '35rem',
        });
    }

    ShowModalUpdateDeatil() {
        const ref = this.dialogService.open(UpdateDetailComponent, {
            header: 'Actualizar detalle',
            width: '70rem',
        });
    }
}
