import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { getAllLiquidationsUseCase } from '../../../../core/usecase/settlement/get-all-liquidations.usecase';
import { PAGE_SIZE } from 'src/app/common/helpers/constants/pagination.constants';
import { LoaderService } from '../../../../common/shared/components/loader/loader.service';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetAllCompaniesUseCase } from '../../../../core/usecase/utils/get-all-companies.usecase';
import { GetUnitByIdUseCase } from '../../../../core/usecase/utils/get-units-by-id.usecase';
import { DisableLiquidationUsecase } from '../../../../core/usecase/settlement/disable-liquidation.usecase';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { GetParameterByIdUseCase } from '../../../../core/usecase/utils/get-parameter-by-id.usecase';
import { Router } from '@angular/router';
import { GetBranchOfficeById } from '../../../../core/usecase/utils/get-branch-offices-by-id.usecase';
import { GetStoreById } from '../../../../core/usecase/utils/get-store-by-id.usecase';
import { LiquidationStatus } from 'src/app/common/helpers/enums/liquidation-status.enum';
import { enter } from 'src/app/common/helpers/animations/enter.animation';
import { LiquidationSearchRequest } from 'src/app/core/models/settlement/request/liquidation-search.request';
import { AdditionalData, PaginatedResponse } from 'src/app/core/models/common/response/paginated.response';
import { AllLiquidationResponse } from 'src/app/core/models/settlement/responses/all-liquidations.response';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { Subject, TimeoutConfig, debounceTime } from 'rxjs';
import { GetReportPdfLiquidationByIdUseCase } from 'src/app/core/usecase/settlement/get-report-pdf-liquidation-by-id.usecase';
import saveAs from 'save-as';
import { GetReportExcelLiquidationByIdUseCase } from 'src/app/core/usecase/settlement/get-report-excel-liquidation-by-id.usecase';
import { GetUnitByCompanyBranchOfficeResponse } from 'src/app/core/models/utils/responses/get-unit-by-company-branchOffice';
import { GetStoreByCompanyBranchOfficeUnitResponse } from 'src/app/core/models/utils/responses/get-store-by-company-branchOffice-businessUnit';
import { SharedDataUrlService } from 'src/app/common/shared/services/shared-data-url.service';
import { MsalService } from '@azure/msal-angular';
import { LiquidationDisableRequest } from 'src/app/core/models/settlement/request/liquidation-disable-request';
import { TypeCurrency } from 'src/app/common/helpers/enums/type-currency.enum';
import { TypeCurrencyList } from 'src/app/common/helpers/constants/currency_type_list.constants';

@Component({
    selector: 'app-manage-settlement',
    templateUrl: './manage-settlement.component.html',
    styleUrls: ['./manage-settlement.component.scss'],
    animations: [enter],
})

export class ManageSettlementComponent implements OnInit {

    formFilterLiquidation: FormGroup;
    message: string;
    viewFilter: boolean = false
    additional_data: AdditionalData;

    pageSize = PAGE_SIZE;
    pageSizeOptions: number[] = [5, 10, 15];

    lCompany: ParameterModel[] = [];
    lBranchOffice: ParameterModel[] = [];
    lUnit: ParameterModel[] = [];
    lStore: ParameterModel[] = []
    lStatus: ParameterModel[] = [];
    lcurrency: ParameterModel[] = [];
    lLiquidation: AllLiquidationResponse[] = [];
    currencyTypeList = TypeCurrencyList

    textCurrency: string = 'Desactivado';

    options: MenuItem[]
    optionsByStatus: any
    liquidationSelected: AllLiquidationResponse

    constructor(
        private _formBuilder: FormBuilder,
        public dialogService: DialogService,
        public loaderService: LoaderService,
        private _confirmationService: ConfirmationService,
        private _alertService: AlertService,
        private _getAllLiquidations: getAllLiquidationsUseCase,
        private _disableLiquidation: DisableLiquidationUsecase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllStatus: GetParameterByIdUseCase,
        private _getReportPdfLiquidationById: GetReportPdfLiquidationByIdUseCase,
        private _getReportExcelLiquidationById: GetReportExcelLiquidationByIdUseCase,
        private _getBrancByCompnyId: GetBranchOfficeById,
        private _getStoreByUnitId: GetStoreById,
        private _getUnitsById: GetUnitByIdUseCase,
        private _router: Router,
        private _sharedDataService: SharedDataUrlService,
        private msalService: MsalService,
    ) {}

    ngOnInit() {

        this.createFormLiquidation()
        this.subscribeLiquidationObserver()
        this.getAllLiquidations()
        this.getAllCompanies()
        this.getAllStatus()
        this.setAllOptions()
        this.getAllCoins();
        this.setOptionsByStatus()
        this.actualizarBreadcrumbItems()
    }

    createFormLiquidation() {
        this.formFilterLiquidation = this._formBuilder.group({
            term: [null],
            company: [null],
            branch_office: [null],
            business_unit: [null],
            store: [null],
            status: [null],
            type_currency: [null],
        });
    }
    actualizarBreadcrumbItems() {
      const newItems: MenuItem[] = [
        { label: 'Inicio' },
        { label: 'Liquidación' },
        { label: 'Buscar liquidación' }
      ];
      this._sharedDataService.setBreadcrumbItems(newItems);
    }
    getName(): string {
      return localStorage.getItem('name')
    }
    async subscribeLiquidationObserver() {

        this.formFilterLiquidation.valueChanges.subscribe(() => {
            this.getAllLiquidations()
        })
    }

    async getAllCompanies() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
            this.lCompany = response.data
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getBranchOfficeByCompanyId(id: number) {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getBrancByCompnyId.execute(id);
            this.lBranchOffice = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllUnits(idCompany: number, idBranchOffice: number) {

        try {
            const params: GetUnitByCompanyBranchOfficeResponse = { idCompany: idCompany, idBranchOffice: idBranchOffice }
            const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(params);
            this.lUnit = response.data;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getStoreByUnitId(idCompany: number, idBranchOffice: number, idBusinessUnit: number) {

        try {
            const params: GetStoreByCompanyBranchOfficeUnitResponse = { idCompany: idCompany, idBranchOffice: idBranchOffice, idBusinessUnit: idBusinessUnit }
            const response: ResponseData<ParameterModel[]> = await this._getStoreByUnitId.execute(params)
            this.lStore = response.data
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllStatus() {

        try {
            const STATUS_ID = '12';
            const response: ResponseData<ParameterModel[]> = await this._getAllStatus.execute(STATUS_ID);
            this.lStatus = response.data;

            this.lStatus = response.data.filter(
                (data) =>
                    data.detail_code != LiquidationStatus.Deleted
            );

        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    async getAllCoins() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("1")
            this.lcurrency = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllLiquidations(pageNumber?: number) {

        try {
            const form = this.formFilterLiquidation.value;

            const request: LiquidationSearchRequest = {
                page_number: pageNumber ?? 0,
                page_size: this.pageSize,
                term: form.term ?? '',
                id_company: form.company ?? 0,
                id_branch_office: form.branch_office ?? 0,
                id_business_unit: form.business_unit ?? 0,
                id_store: form.store ?? 0,
                id_status: form.status ?? 0,
                type_currency: form.type_currency ?? 2,
                user: localStorage.getItem('access')=="false" ? localStorage.getItem('username') : ''
            }

            const response: ResponseData<PaginatedResponse<AllLiquidationResponse>> = await this._getAllLiquidations.execute(request)

            this.lLiquidation = response.data.result
            this.additional_data = response.data.additional_data
            this.message = response.message
        }

        catch (error) {
            console.log('Error: ', error);

            this.lLiquidation = null
            this.additional_data = null
            this.message = null
        }
    }

    async disableLiquidation(idLiquidation: number, clientName: string) {

        try {
            this._confirmationService.confirm({
                message: `¿Deseas anular la liquidación Nº ${idLiquidation} con el cliente ${clientName}?`,
                accept: async () => {
                    const request : LiquidationDisableRequest={
                        id : idLiquidation,
                        user : localStorage.getItem('username')
                    }
                    const data: ResponseData<number> = await this._disableLiquidation.execute(request);

                    this._alertService.success(data.message)
                    this.getAllLiquidations();
                },
                reject: async () => {
                    this._alertService.warn('No se anulo la liquidación.')
                }
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    registerSettlement() {
        this._router.navigate(['admin/settlement/register']);
    }

    updateSettlement(id: number) {
        this._router.navigate(['admin/settlement/update', id]);
    }

    onChangeCompany(idCompany: number) {

        this.lBranchOffice = null
        this.lUnit = null
        this.lStore = null
        if (idCompany) this.getBranchOfficeByCompanyId(idCompany)
    }

    onChangeBranchOffice(idBranchOffice: number) {
        const idCompany = this.formFilterLiquidation.get('company').value

        this.lUnit = null
        this.lStore = null
        if (idBranchOffice) this.getAllUnits(idCompany, idBranchOffice)
    }

    onChangeBusinessnit(idBusinessUnit: number) {
        const idCompany = this.formFilterLiquidation.get('company').value
        const idBranchOffice = this.formFilterLiquidation.get('branch_office').value

        this.lStore = null
        if (idBusinessUnit) this.getStoreByUnitId(idCompany, idBranchOffice, idBusinessUnit)
    }

    onChangeCurrencyType() {

        const typeCurrency = this.formFilterLiquidation.get('type_currency').value
        this.setTextCurrency(typeCurrency)
    }

    onPageSizeChange(pageSize: number) {
        this.pageSize = pageSize
    }

    getStatusLiquidation(code_status: string): string {

        const statusLiquidation = {
            [LiquidationStatus.Draft]: 'component-draft',
            [LiquidationStatus.ServiceOrder]: 'component-active',
            [LiquidationStatus.Pending]: 'component-pending',
            [LiquidationStatus.Canceled]: 'component-inactive',
            [LiquidationStatus.ParcialServiceOrder]: 'component-pending',
        };
        return statusLiquidation[code_status] || ''
    }

    setTextCurrency(typeCurrency: number) {

        if (typeCurrency == 1) this.textCurrency = 'Ver en S/'
        if (typeCurrency == 2) this.textCurrency = 'Desactivado'
        if (typeCurrency == 3) this.textCurrency = 'Ver en $'
    }

    clearFilterLiquidation() {

        this.formFilterLiquidation.reset()
        this.setTextCurrency(2)
    }

    setAllOptions() {
        this.options = [
            {
                label: 'Ver detalle',
                command: () => { }
            },
            {
                label: 'Editar',
                command: () => { this.updateSettlement(this.liquidationSelected.id) }
            },
            {
                label: 'Anular',
                command: () => {
                    this.disableLiquidation(this.liquidationSelected.id, this.liquidationSelected.client_name)
                }
            },
            {
                label: 'Descargar PDF',
                command: () => { this.getReportPdfLiquidationById(this.liquidationSelected.id) }
            },
            {
                label: 'Descargar XLSX',
                command: () => { this.getReportExcelLiquidationById(this.liquidationSelected.id) }
            }
        ]
    }

    setOptionsByStatus() {
        this.optionsByStatus = {
            [LiquidationStatus.Draft]: [this.options[1], this.options[2], this.options[3], this.options[4]],
            [LiquidationStatus.ServiceOrder]: [this.options[3], this.options[4]],
            [LiquidationStatus.Pending]: [this.options[1], this.options[2], this.options[3], this.options[4]],
            [LiquidationStatus.Canceled]: [this.options[3], this.options[4]],
            [LiquidationStatus.ParcialServiceOrder]: [this.options[3], this.options[4]],
        }
    }

    getOptionsByStatus(liquidation: AllLiquidationResponse) {
        this.liquidationSelected = liquidation
        this.options = this.optionsByStatus[liquidation.status_code]
    }

    async getReportPdfLiquidationById(idLiquidation: number) {

        try {
            const response: ResponseData<Blob> = await this._getReportPdfLiquidationById.execute(idLiquidation);

            if (!response) {
                this._alertService.warn('La liquidación no tiene servicios y/o detalles operativos.')
                return
            }
            saveAs(response, `Reporte_Liquidacion_${idLiquidation}`);
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async getReportExcelLiquidationById(idLiquidation: number) {

        try {
            const response: Blob = await this._getReportExcelLiquidationById.execute(idLiquidation);

            if (!response) {
                this._alertService.warn('La liquidación no tiene servicios y/o detalles operativos.')
                return
            }

            const contentType: string = 'application/vnd.ms-excel';
            const file = new Blob([response], { type: contentType });
            saveAs(file, `Reporte_Liquidacion_${idLiquidation}.xlsx`);
        }
        catch (error) {
            console.log("Error", error)
        }
    }
}
