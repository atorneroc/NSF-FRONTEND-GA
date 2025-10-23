import { Component, OnInit, ViewChild } from "@angular/core";
import { AutoComplete } from 'primeng/autocomplete';
import { ResponseData } from "src/app/core/models/response.model";
import { ParameterModel } from "src/app/core/models/parameter.model";
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LiquidationModel, SettlementDetail } from "src/app/core/models/liquidation.model";
import { RegisterLiquidationUsecase } from "src/app/core/usecase/settlement/register-liquidation.usecase";
import { setDateFormat } from "src/app/common/validator/date";
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { GetAllCompaniesUseCase } from "src/app/core/usecase/utils/get-all-companies.usecase";
import { GetUnitByIdUseCase } from "src/app/core/usecase/utils/get-units-by-id.usecase";
import { GetClientByNameUsecase } from "src/app/core/usecase/client/client/get-client-by-name.usecase";
import { GetBranchOfficeById } from "src/app/core/usecase/utils/get-branch-offices-by-id.usecase";
import { GetStoreById } from "src/app/core/usecase/utils/get-store-by-id.usecase";
import { RateSearch, RateRangeSearch, RateDetailSearch, RateCreateServiceSearch } from '../../../../../../core/models/liquidation.model';
import { GetRatesUseCase } from '../../../../../../core/usecase/settlement/get-rates.usecase';
import { GetRatesRangeUseCase } from '../../../../../../core/usecase/settlement/get-rates-range.usecase';
import { ServiceRateModel, OperationalDetailGroup, ServiceRateRangeModel } from '../../../../../../core/models/rate.model';
import { Router } from "@angular/router";
import { GetExchangeRateUseCase } from "src/app/core/usecase/utils/get-exchange-rate.usecase";
import { ExchangeRateModel } from "src/app/core/models/exchange-rate.model";
import { AlertService } from "src/app/common/shared/services/alert.service";
import { invalid } from "src/app/common/helpers/constants/alert.constants";
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import saveAs from 'save-as';
import { DialogService } from "primeng/dynamicdialog";
import { RegisterOperationalDetailComponent } from "../register-operational-detail/register-operational-detail.component";
import { GetUnitByCompanyBranchOfficeResponse } from "src/app/core/models/utils/responses/get-unit-by-company-branchOffice";
import { GetStoreByCompanyBranchOfficeUnitResponse } from "src/app/core/models/utils/responses/get-store-by-company-branchOffice-businessUnit";
import { TypeCurrency } from 'src/app/common/helpers/enums/type-currency.enum';
import { RegisterServiceComponent } from "../register-service/register-service.component";
import { ConfirmationService, MenuItem } from 'primeng/api';
import { tariffValidator } from 'src/app/common/validator/validator';
import { SharedDataUrlService } from "src/app/common/shared/services/shared-data-url.service";
import { RateType } from 'src/app/common/helpers/constants/rate_type.constants'
import { InputNumber } from "primeng/inputnumber";
import * as moment from "moment-timezone";
import { BranchService } from 'src/app/core/application/services/branch.service';

@Component({
    selector: 'app-register-settlement',
    templateUrl: './register-settlement.component.html',
    styleUrls: ['./register-settlement.component.scss'],
})

export class RegisterSettlementComponent implements OnInit {
    @ViewChild('client_code') clientcodeAutocomplete: AutoComplete;

    lRates: LiquidationModel[] = [];
    rates: LiquidationModel[] = [];

    mensaje: string;
    cant: any;
    exchangeRate: ExchangeRateModel;
    isDollarSelected = false;
    typeCoin :string =TypeCurrency.Sol;
    isListServices = true;
    isDisabledRegister = true;
    selectedCategory = 1;
    minFinishDate: Date;
    formHeadSettlement: FormGroup;
    formBodySettlement: FormGroup;
    coins: ParameterModel[] = [];
    units: ParameterModel[] = [];
    companies: ParameterModel[] = [];
    branchOffice: ParameterModel[] = [];
    storeList: ParameterModel[] = [];
    lrateType: ParameterModel[] = [];
    detailList: SettlementDetail[] = [];
    clients: any[] = [];
    list: any[] = [];
    debounce: any;
    lStatus: ParameterModel[] = [];
    frase: string = "";
    maxLengthQuantity:number=8;
    typeRate: any = RateType
    isGetClientByFilterActive: boolean = false;
    clientList: any[] = [];

    constructor(
        public validateService: ValidateInputService,
        public loaderService: LoaderService,
        public dialogService: DialogService,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _formBuilder: FormBuilder,
        private _registerLiquidation: RegisterLiquidationUsecase,
        private _getUnitsById: GetUnitByIdUseCase,
        private _getClientByName: GetClientByNameUsecase,
        private _getBrancByCompanyId: GetBranchOfficeById,
        private _getStoreByUnitId: GetStoreById,
        private _alertService: AlertService,
        private _getRates: GetRatesUseCase,
        private _getExchangeRateByDate: GetExchangeRateUseCase,
        private _router: Router,
        private _getRatesRange: GetRatesRangeUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllStatus: GetParameterByIdUseCase,
        private _confirmationService: ConfirmationService,
        private _sharedDataService: SharedDataUrlService,
        private _branchService: BranchService,
    ) { }

    ngOnInit() {
        this.getAllCompanies();
        this.createFormHeadSettlement();
        this.createFormBodySettlement();
        this.getCurrentExchangeRate();
        this.getAllCoins().then(()=>{
            this.changeTypeCoinDefault()
        })
        this.getAllStatus();
        this.actualizarBreadcrumbItems()
        this.getRateType()
    }

    createFormHeadSettlement() {
        this.formHeadSettlement = this._formBuilder.group({
            company_id: [null, Validators.required],
            business_unit_id: [null, Validators.required],
            branch_office_id: [null, Validators.required],
            // client_id: [null],// [null, Validators.required],
            store: [null, Validators.required],
            type_currency_param: [null, Validators.required],
            client: [null],// [null, Validators.required],
        });
    }

    createFormBodySettlement() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.formBodySettlement = this._formBuilder.group({
            service_start_date: [firstDayOfMonth, Validators.required],
            service_finish_date: [lastDayOfMonth, Validators.required],
            total_price: [null],
            type_currency: [1],
            igv: [false],
            rates_detail: this._formBuilder.array([]),
            rates_detail_bd: this._formBuilder.array([]),
        });
    }

    actualizarBreadcrumbItems() {
      const newItems: MenuItem[] = [
        { label: 'Inicio' },
        { label: 'Liquidación', routerLink:'settlement/' },
        { label: 'Crear Liquidación' }
      ];
      this._sharedDataService.setBreadcrumbItems(newItems);
    }
    async getAllCompanies() {
        try {
            const response: ResponseData<ParameterModel[]> =
                await this._getAllcompanies.execute();
            this.companies = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllUnits(idCompany: number, idBranchOffice: number) {
        try {
            /*const response: ResponseData<ParameterModel[]> =
                await this._getUnitsById.execute(id);*/
            const params: GetUnitByCompanyBranchOfficeResponse = { idCompany: idCompany, idBranchOffice: idBranchOffice }
            const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(params);
            this.units = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getBranchOfficeByCompanyId(id: number) {
        try {
            const response: ResponseData<ParameterModel[]> =
                await this._getBrancByCompanyId.execute(id);
            this.branchOffice = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getStoreByUnitId(idCompany: number, idBranchOffice: number, idBusinessUnit: number) {
        try {
            /*const response: ResponseData<ParameterModel[]> =
                await this._getStoreByUnitId.execute(id);*/
            const params: GetStoreByCompanyBranchOfficeUnitResponse = { idCompany: idCompany, idBranchOffice: idBranchOffice, idBusinessUnit: idBusinessUnit }
            const response: ResponseData<ParameterModel[]> = await this._getStoreByUnitId.execute(params)
            this.storeList = response.data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getClientByName(value: any) {
        try {
            this.clients = [];
            if (!value) return;
            clearTimeout(this.debounce); // Cancelar cualquier temporizador existente

            this.debounce = setTimeout(async () => {
                const response: any = await this._getClientByName.execute(value);
                this.clients = response.data;
            }, 500);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async getCurrentExchangeRate() {
        try {
            const limaTimezone = 'America/Lima';
            const dateInLima = moment().tz(limaTimezone);
            const currentDateUtc = dateInLima.format('YYYY-MM-DD');
            const response: ResponseData<ExchangeRateModel> =
                await this._getExchangeRateByDate.execute(currentDateUtc);
            this.exchangeRate = response.data;
        } catch (error) {
            console.log('Error: ', error);
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

    async getRateType() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("24")
            this.lrateType = response.data

        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    changeTypeCoinDefault(){
      const idTypeCurrency = this.coins.find(f => f.detail_code==TypeCurrency.Sol).id
      this.formHeadSettlement.get('type_currency_param').setValue(idTypeCurrency);
    }

    onChangeCompany() {
        this.formHeadSettlement.get('branch_office_id').reset();
        this.formHeadSettlement.get('business_unit_id').reset();
        this.formHeadSettlement.get('store').reset();
        this.branchOffice = [];
        const idCompany = this.formHeadSettlement.get('company_id').value;

        if (idCompany) this.getBranchOfficeByCompanyId(idCompany);
    }

    onChangeBranch(): void {
        const idBranchOffice = this.formHeadSettlement.get('branch_office_id').value;
        const idCompany = this.formHeadSettlement.get('company_id').value;
        this.units = [];

        if (idBranchOffice) this.getAllUnits(idCompany, idBranchOffice);
    }

    onChangeTypeCurrency(currencyType: ParameterModel) {
        this.formBodySettlement.get('type_currency').setValue(currencyType?.id);
    }

    onChangeUnit() {
        const idCompany = this.formHeadSettlement.get('company_id').value;
        const idBranchOffice = this.formHeadSettlement.get('branch_office_id').value;
        const idUnit = this.formHeadSettlement.get('business_unit_id').value;

        this.storeList = [];
        if(idUnit) this.getStoreByUnitId(idCompany, idBranchOffice, idUnit);
    }

    get rates_detail() {
        return this.formBodySettlement.controls['rates_detail'] as FormArray;
    }

    get rates_detail_bd() {
        return this.formBodySettlement.controls['rates_detail_bd'] as FormArray;
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

    async getRates() {
        try {
          const form = this.formHeadSettlement.value;
          const idcliente = form.client?.id || 0
            if (idcliente>0) {
                if (this.formHeadSettlement.invalid ) {
                    this._alertService.warn(invalid);
                    this.formHeadSettlement.markAllAsTouched()
                    return;
                }

                const form = this.formHeadSettlement.value;
                const params: RateSearch = {
                    company_id: form.company_id || 0,
                    branch_office_id: form.branch_office_id || 0,
                    business_unit_id: form.business_unit_id || 0,
                    idStore: form.store || 0,
                    idclient: form.client.id || 0,
                    idtypecurrency: form.type_currency_param || 0,
                };
                const [typeCurrency] = this.coins.filter(value => value.id == form.type_currency_param)

                if (typeCurrency.detail_code===TypeCurrency.Dolar.toString()) {
                    this.isDollarSelected=true
                    this.formBodySettlement.get('type_currency').setValue(typeCurrency.detail_code)
                    this.typeCoin=TypeCurrency.Dolar.toString()
                }
                if (typeCurrency.detail_code===TypeCurrency.Sol.toString()) {
                  this.isDollarSelected=false
                  this.formBodySettlement.get('type_currency').setValue(typeCurrency.detail_code)
                  this.typeCoin=TypeCurrency.Sol.toString()
              }

                const response: ResponseData<ServiceRateModel[]> = await this._getRates.execute(params);

                this.clearFormArray(this.rates_detail);
                this.addRatesToList(response.data);

                this.list = response.data.map((service) => {
                    service.lstgroups.map((group) => {
                        group.isOpen = true;
                        return group;
                    })
                    return service
                });
                this.cant = response.data.length;
                this.mensaje = response.message;
            }
        }

        catch (error) {
            console.log('Error: ', error);
            this.mensaje = null;
        }
    }

    deleteGroup(nameGroup: string| undefined, serviceIndex: number, groupIndex: number, rateIndex: number, rateIndex2: number){
        try {
            this._confirmationService.confirm({
                message: `¿Estas seguro de eliminar el grupo ${nameGroup==undefined ? "":nameGroup} ?`,
                accept: async () => {
                    let index = 0;
                    this.list.forEach((service) => {
                        service.lstgroups.forEach((group) => {
                            group.lstdetails.forEach((rate) => {

                                const valueRate = this.rates_detail.controls[index].value;
                                rate.quantity = valueRate.quantity || 0;
                                rate.operational_detail_price = valueRate.operational_detail_price || 0;
                                rate.total_price = rate.quantity * rate.operational_detail_price;
                                index += 1;
                            })
                        });
                    });


                    this.list[serviceIndex].lstgroups[groupIndex].lstdetails.splice(0)
                    this.list[serviceIndex].lstgroups.splice(groupIndex, 1)
                    //const cantlstdetails = this.list[serviceIndex].lstgroups[groupIndex].lstdetails.length;
                    //if (cantlstdetails == 0) this.list[serviceIndex].lstgroups.splice(groupIndex, 1)

                    const cantlstgroups = this.list[serviceIndex].lstgroups.length;
                    if (cantlstgroups == 0) this.list.splice(serviceIndex, 1)

                    this.clearFormArray(this.rates_detail);
                    this.addRatesToList(this.list);
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

    deleteOperationalDetail(serviceIndex: number, groupIndex: number, rateIndex: number, rateIndex2: number) {
        try {
            this._confirmationService.confirm({
                message: `¿Estas seguro de eliminar el detalle operativo?`,
                accept: async () => {
                    let index = 0;
                    this.list.forEach((service) => {
                        service.lstgroups.forEach((group) => {
                            group.lstdetails.forEach((rate) => {

                                const valueRate = this.rates_detail.controls[index].value;
                                rate.quantity = valueRate.quantity;
                                rate.operational_detail_price = valueRate.operational_detail_price;
                                rate.total_price = rate.quantity * rate.operational_detail_price;
                                index += 1;
                            })
                        });
                    });


                    this.list[serviceIndex].lstgroups[groupIndex].lstdetails.splice(rateIndex, 1)

                    const cantlstdetails = this.list[serviceIndex].lstgroups[groupIndex].lstdetails.length;
                    if (cantlstdetails == 0) this.list[serviceIndex].lstgroups.splice(groupIndex, 1)

                    const cantlstgroups = this.list[serviceIndex].lstgroups.length;
                    if (cantlstgroups == 0) this.list.splice(serviceIndex, 1)

                    this.clearFormArray(this.rates_detail);
                    this.addRatesToList(this.list);
                    //this.rates_detail.removeAt(rateIndex2)
                    console.log(this.list)
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

    addRatesToList(services: ServiceRateModel[]) {
        services.forEach((service) => {
            service.lstgroups.forEach((group) => {
                group.lstdetails.forEach((rate) => {
                    const form = this._formBuilder.group({
                        id: [rate.id_detail_operational],
                        quantity: [rate.quantity, [tariffValidator()]],
                        total_price: [rate.total_price],
                        operational_detail_price: [rate.operational_detail_price==0?0:rate.operational_detail_price, [tariffValidator()]],
                        operational_detail_price_Temp: [rate.operational_detail_price],
                        description: [rate.operational_detail_description],
                        unit_measure_param: [rate.id_unit_measure],
                        igv: [true],
                        counterFiles: [null],
                        files: [null],
                        rate_val: [null],
                        rate_val_temp: [null],
                        rate_type_parameter: [rate.rate_type_parameter],
                        code_type_rate:[rate.code_type_rate],
                        id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                        id_service_organizational_structure: [rate.id_service_organizational_structure],
                        operational_detail_description: [rate.operational_detail_description],
                        total_Amount_Operational_Detail: [null],
                        total_amount_operational_detail_foreign_currency: [null],
                        total_amount_operational_detail_national_currency: [null],
                        id_service: [rate.id_service],
                        id_rate: [rate.id_rate],
                        id_group: group.id_group
                    });

                    this.rates_detail.push(form);
                    //this.rates_detail_bd.push(form);
                    rate.formIndex = this.rates_detail.length - 1;

                })
            });
        });
    }

    addOperationalDetail(operationalDetail: OperationalDetailGroup) {
        operationalDetail.lstdetails.forEach((rate) => {
            const form = this._formBuilder.group({
                id: [rate.id_detail_operational],
                total_price: [rate.total_price],
                operational_detail_price: [rate.operational_detail_price, [tariffValidator()]],
                operational_detail_price_Temp: [rate.operational_detail_price],
                description: [rate.operational_detail_description],
                unit_measure_param: [rate.id_unit_measure],
                igv: [true],
                counterFiles: [null],
                files: [null],
                rate_val: [null],
                rate_val_temp: [null],
                quantity: [rate.quantity, [tariffValidator()]],
                rate_type_parameter: [rate.rate_type_parameter],
                code_type_rate: [rate.code_type_rate],
                id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                id_service_organizational_structure: [rate.id_service_organizational_structure],
                operational_detail_description: [rate.operational_detail_description],
                total_Amount_Operational_Detail: [null],
                total_amount_operational_detail_foreign_currency: [null],
                total_amount_operational_detail_national_currency: [null],
                id_service: [rate.id_service],
                id_group: [rate.id_group],
                id_rate: [rate.id_rate],
            });
            this.rates_detail.push(form);
            rate.formIndex = this.rates_detail.length - 1;
        });
        this.getTotalPrice();
    }

    async registerLiquidation(saveType: string) {

        if (!this.exchangeRate) {
            this._alertService.warn('No se tiene el tipo de cambio del dia');
            return;
        }

        const length=this.formBodySettlement.get('total_price').value==null?0:this.formBodySettlement.get('total_price').value;
        if (length.toString().split('.')[0].length>8) {
            this._alertService.warn('Excediste el máximo valor permitido');
            return;
        }

        if (this.list.length == 0) {
            this._alertService.warn('No se tiene ningún servicio y/o detalle operativo añadido')
            return
        }

        if (this.formHeadSettlement.invalid || this.formBodySettlement.invalid) {
            this._alertService.warn(invalid);
            this.formHeadSettlement.markAllAsTouched()
            this.formBodySettlement.markAllAsTouched()
            return;
        }

        try {
            const formSettlement = this.formHeadSettlement.value;
            const formDetail = this.formBodySettlement.value;
            let total_Amount_Liquidation_Foreign_Currency = 0;
            let total_Amount_Liquidation_National_Currency = 0;

            if (this.isDollarSelected) {
                total_Amount_Liquidation_Foreign_Currency = this.formBodySettlement.get('total_price').value || 0;
                total_Amount_Liquidation_National_Currency = this.formBodySettlement.get('total_price').value * this.exchangeRate.bank_purchase || 0;
            }
            else {
                total_Amount_Liquidation_Foreign_Currency = this.formBodySettlement.get('total_price').value / this.exchangeRate.bank_purchase || 0;
                total_Amount_Liquidation_National_Currency = this.formBodySettlement.get('total_price').value || 0;
            }
            const [typeCurrency] = this.coins.filter(value => value.detail_code == formDetail.type_currency)
            const [typeSaveLiquidation] = this.lStatus.filter(data => data.detail_code === saveType)

            const liquidation: LiquidationModel = {
                id_Client: formSettlement.client?.id,
                service_Start_Date: setDateFormat(formDetail.service_start_date),
                service_finish_date: setDateFormat(formDetail.service_finish_date),
                type_Currency_Parameter: typeCurrency.id || 0,
                exchange_Rate_Value: this.exchangeRate.bank_purchase,
                id_Company: formSettlement.company_id,
                id_Branch_Office: formSettlement.branch_office_id,
                id_Business_Unit: formSettlement.business_unit_id,
                id_Store: formSettlement.store,
                total_Amount_Liquidation: this.formBodySettlement.get('total_price').value|| 0,
                total_Amount_Liquidation_Foreign_Currency: total_Amount_Liquidation_Foreign_Currency,
                total_Amount_Liquidation_National_Currency: total_Amount_Liquidation_National_Currency,
                user: localStorage.getItem('username'),
                status_Parameter: typeSaveLiquidation.id,
                liquidation_Detail_Operational: [],
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

                let total_amount_operational_detail_foreign_currency = 0
                let total_amount_operational_detail_national_currency = 0

                if (this.isDollarSelected) {
                    total_amount_operational_detail_foreign_currency = form.get('total_price').value || 0;
                    total_amount_operational_detail_national_currency = form.get('total_price').value * this.exchangeRate.bank_purchase || 0;
                }
                else {
                    total_amount_operational_detail_foreign_currency = form.get('total_price').value / this.exchangeRate.bank_purchase || 0;
                    total_amount_operational_detail_national_currency = form.get('total_price').value || 0;
                }

                liquidation.liquidation_Detail_Operational.push({
                    id_detail_operational_organizational_structure: form.get('id_detail_operational_organizational_structure').value || 0,
                    id_service_organizational_structure: form.get('id_service_organizational_structure').value || 0,
                    id_unit_measure: form.get('unit_measure_param').value || 0,
                    id_service: form.get('id_service').value || 0,
                    unit_Amount_Operational_Detail: form.get('operational_detail_price').value || 0,
                    total_Amount_Operational_Detail: form.get('total_price').value || 0,
                    total_amount_operational_detail_foreign_currency,
                    total_amount_operational_detail_national_currency,
                    quantity: form.get('quantity').value || 0,
                    id_Liquidation_Detail_Service: 0,
                    rate_Type_Parameter: form.get('rate_type_parameter').value,
                    id_group: form.get('id_group').value || 0,
                    id_rate: form.get('id_rate').value || 0,
                    files: await Promise.all((form.get("files").value || []).map(async (file) => await this.getBase64(file)))
                });

            }

            const data: any = await this._registerLiquidation.execute(liquidation);

            this._alertService.success(data.message || 'Registrado correctamente');
            this._router.navigate(['admin/settlement']);
        }

        catch (error) {
            console.log(error);
        }
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
        form.get("files").setValue([])
        fileUpload.clear()
    }

    downloadFiles(index: number) {
        const form = this.rates_detail.controls[index];
        const files = form.get("files").value
        files.forEach(file => {
            saveAs(file, file.name)
        })
    }

    showFileExplorer(fileUpload) {
        fileUpload.advancedFileInput.nativeElement.click()
    }

    calcMinFinishDate(selectedStartDate: Date) {
        this.formBodySettlement.get('service_finish_date').reset();
        const minDate = new Date(selectedStartDate);
        this.minFinishDate = minDate;
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

    //Calcula subtotales por tipo
    calcSubtotalByTypeRateQuantity(event: any, formIndex: number, typeRate: number, inputNumber: InputNumber) {
        if (typeRate == this.typeRate.NORMAL) {
            this.calcSubTotal(event.value, formIndex)
        }
        if (typeRate == this.typeRate.EDITABLE) {
            this.calcSubTotal(event.value, formIndex)
        }
        if (typeRate == this.typeRate.RANGO) {
            this.getRateByQuantity(event.value, formIndex, inputNumber).then(()=>{
              //this.calcSubTotal(value.target.value, formIndex)
            })
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

    //calcular el subtotal con la cantidad por rango
    async getRateByQuantity(quantity: number, formIndex: number, inputNumber: InputNumber) {
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

          form.get('operational_detail_price').setValue(this.isDollarSelected? (form.get('operational_detail_price_Temp').value / this.exchangeRate.bank_purchase): form.get('operational_detail_price_Temp').value);
        } else {
          // Realizar la búsqueda de tarifas usando el servicio _getRatesRange
          try {
            const response: ResponseData<ServiceRateRangeModel> = await this._getRatesRange.execute(params);
            const rateAmountRange = response.data.rate_amount_range;

            // Verificar si el rango de tarifas es válido antes de establecerlo
            if (rateAmountRange === null || rateAmountRange === 0 || rateAmountRange.toString().trim() === "") {
              form.get('operational_detail_price').setValue(this.isDollarSelected? (form.get('operational_detail_price_Temp').value / this.exchangeRate.bank_purchase):form.get('operational_detail_price_Temp').value);
            } else {
              form.get('quantity').setValue(quantity)
              form.get('operational_detail_price').setValue(this.isDollarSelected? (rateAmountRange / this.exchangeRate.bank_purchase):rateAmountRange);
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

    calcSubTotalByQuantityRateRange(value: number, formIndex: number) {
      const form = this.rates_detail.controls[formIndex];
      const total = form.get('operational_detail_price').value * value;
      form.get('total_price').setValue(total);
      this.getTotalPrice();
    }

    registerOperationalDetail(service: ServiceRateModel) {
        let numeros: number[] = [];

        service.lstgroups.forEach((group) => {
            group.lstdetails.forEach((rate) => {
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

            const index_service = this.list.findIndex(
                (res) => res.id_service_organizational_structure === service.id_service_organizational_structure
            )
            //id_service_organizational_structure
            const body: OperationalDetailGroup = {
                id_group: operationaldetail.grouper,
                group_name: operationaldetail.grouper_description,
                isOpen: true,
                lstdetails: [{
                    id_detail_operational: operationaldetail.operational_detail,
                    operational_detail_description: operationaldetail.operational_detail_description,
                    id_unit_measure: operationaldetail.unit_measure,
                    unit_measure_description: operationaldetail.unit_measure_description,
                    operational_detail_price: operationaldetail.tariff,
                    total_price: operationaldetail.subtotal_price,
                    rate_type_parameter: this.lrateType.find(f => f.detail_code===this.typeRate.EDITABLE).id,// 223,
                    code_type_rate: this.typeRate.EDITABLE,// 223,
                    id_rate: 0,
                    quantity: operationaldetail.quantity,
                    id_detail_operational_organizational_structure: operationaldetail.id_detail_operational_organizational_structure,
                    id_service_organizational_structure: operationaldetail.id_service_organizational_structure,
                    id_group: operationaldetail.grouper
                }]
            }

            this.addOperationalDetail(body)

            const index_group = this.list[index_service].lstgroups.findIndex(
                (res) => res.id_group === body.id_group
            )

            if (index_group >= 0) {

                this.list[index_service].lstgroups[index_group].lstdetails.push(body.lstdetails.shift())

            } else {
                this.list[index_service].lstgroups.push(body)
            }


        })
    }

    registerService() {
        const form = this.formHeadSettlement.value;
        let idDetailOperationalAdded: number[] = [];
        let idServicesAdded: number[] = [];
        const [idBase] = this.storeList.filter(value => value.id == this.formHeadSettlement.get('store').value)
        this.list.forEach((service) => {

            idServicesAdded.push(service.id_service_organizational_structure)
            service.lstgroups.forEach((group) => {
                group.lstdetails.forEach((rate) => {
                    idDetailOperationalAdded.push(rate.id_detail_operational_organizational_structure)
                })
            });
        });

        const params: RateCreateServiceSearch = {
            company_id: form.company_id || 0,
            branch_office_id: form.branch_office_id || 0,
            business_unit_id: form.business_unit_id || 0,
            isDollarSelected: this.isDollarSelected,
            lstIdDetailOperational: idDetailOperationalAdded,
            lstIdServicesAdded: idServicesAdded,
            idBase: idBase.id_estructura_base
        };

        const ref = this.dialogService.open(RegisterServiceComponent, {
            data: params,
            header: 'Crear servicio',
            width: '65rem',
        });

        ref.onClose.subscribe((service) => {

            const body: ServiceRateModel =
            {
                id_service: service.accounting_service,
                product_description: service.product_description,
                service_description: service.service_description,
                id_service_organizational_structure: service.id_service_organizational_structure,
                lstgroups: [
                    {
                        id_group: service.grouper,
                        group_name: service.grouper_description,
                        isOpen: true,
                        lstdetails: [
                            {
                                id_detail_operational: service.operational_detail,
                                operational_detail_description: service.operational_detail_description,
                                id_unit_measure: service.unit_measure,
                                unit_measure_description: service.unit_measure_description,
                                operational_detail_price: service.tariff,
                                rate_type_parameter: this.lrateType.find(f => f.detail_code===this.typeRate.EDITABLE).id,
                                code_type_rate:this.typeRate.EDITABLE,
                                id_rate:0,
                                quantity: service.quantity,
                                total_price: service.subtotal_price,
                                id_detail_operational_organizational_structure: service.id_detail_operational_organizational_structure,
                                id_service_organizational_structure: service.id_service_organizational_structure,
                                id_group: service.grouper
                            }
                        ]
                    }
                ]
            };

            this.addRateToList(body)
            this.list.push(body)
        })
    }

    addRateToList(service: ServiceRateModel) {
        service.lstgroups.forEach((group) => {
            group.lstdetails.forEach((rate) => {
                const form = this._formBuilder.group({
                    id: [rate.id_detail_operational],
                    quantity: [rate.quantity, [tariffValidator()]],
                    total_price: [rate.total_price],
                    operational_detail_price: [rate.operational_detail_price, [tariffValidator()]],
                    operational_detail_price_Temp: [rate.operational_detail_price],
                    description: [rate.operational_detail_description],
                    unit_measure_param: [rate.id_unit_measure],
                    igv: [true],
                    counterFiles: [null],
                    files: [null],
                    rate_val: [null],
                    rate_val_temp: [null],
                    rate_type_parameter: [rate.rate_type_parameter],
                    code_type_rate: [rate.code_type_rate],
                    id_detail_operational_organizational_structure: [rate.id_detail_operational_organizational_structure],
                    id_service_organizational_structure: [rate.id_service_organizational_structure],
                    operational_detail_description: [rate.operational_detail_description],
                    total_Amount_Operational_Detail: [null],
                    total_amount_operational_detail_foreign_currency: [null],
                    total_amount_operational_detail_national_currency: [null],
                    id_service: [rate.id_service],
                    id_rate: [rate.id_rate],
                    id_group: [rate.id_group],
                });

                this.rates_detail.push(form);
                rate.formIndex = this.rates_detail.length - 1;
            })
        });
        this.getTotalPrice();
    }

    addComment() { }

    changeValueDollarSelected(isDollarSelected: boolean) {
        const formDetail = this.formBodySettlement.value;
        const [typeCurrency] = this.coins.filter(value => value.detail_code == formDetail.type_currency)
        this.isDollarSelected = isDollarSelected;

        if (this.typeCoin===typeCurrency.detail_code) {

        }
        else{
          this.typeCoin=typeCurrency.detail_code
            if (isDollarSelected) {
              this.rates_detail.controls.forEach((control, index) => {
                  const controlValue = control.value;
                  const form = this.rates_detail.controls[index];
                  controlValue.operational_detail_price = controlValue.operational_detail_price / this.exchangeRate.bank_purchase
                  controlValue.total_price = controlValue.total_price / this.exchangeRate.bank_purchase
                  form.get('operational_detail_price').setValue(controlValue.operational_detail_price);
                  form.get('total_price').setValue(controlValue.total_price);

              });
              }
              else {
                  this.rates_detail.controls.forEach((control, index) => {
                      const controlValue = control.value;
                      const form = this.rates_detail.controls[index];
                      controlValue.operational_detail_price = controlValue.operational_detail_price * this.exchangeRate.bank_purchase
                      controlValue.total_price = controlValue.total_price * this.exchangeRate.bank_purchase
                      form.get('operational_detail_price').setValue(controlValue.operational_detail_price);
                      form.get('total_price').setValue(controlValue.total_price);

                  });
              }
        }

        this.getTotalPrice();
    }

    async getClient(query: string): Promise<void> {
        this.isGetClientByFilterActive = true;
        try {
          const clients = await this._branchService.getClient(
            query,
            this.isGetClientByFilterActive
          );
          this.clientList = clients;
        } catch (error) {
          console.error('Error al recuperar clientes:', error);
        }
    }

    handleClearClient(): void {
        this.formHeadSettlement.get('client')?.reset(); // Primero reseteá
        const form = this.formHeadSettlement.getRawValue();    // Después obtené el valor actualizado                            // Ahora sí, sin cliente
        const ratesDetailArray = this.formBodySettlement.get('rates_detail') as FormArray;
        if (ratesDetailArray && ratesDetailArray.length > 0) {
          while (ratesDetailArray.length !== 0) {
            ratesDetailArray.removeAt(0);
          }
        }
        this.clientList = [];
        this.getRates();
    }
}
