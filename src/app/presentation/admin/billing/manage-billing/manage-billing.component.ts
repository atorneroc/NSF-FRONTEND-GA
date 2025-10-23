import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PAGE_SIZE } from 'src/app/common/helpers/constants/pagination.constants';
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { BillingModel, BillingSearch } from 'src/app/core/models/billing.model';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { DisableBillingUsecase } from 'src/app/core/usecase/billing/disable-billing.usecase';
import { GetAllBillingsUsecase } from 'src/app/core/usecase/billing/get-all-billing.usecase';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { GetBranchOfficeById } from 'src/app/core/usecase/utils/get-branch-offices-by-id.usecase';
import { GetUnitByIdUseCase } from 'src/app/core/usecase/utils/get-units-by-id.usecase';
import { RegisterBillingComponent } from './components/register-billing/register-billing.component';
import { GetUnitByCompanyBranchOfficeResponse } from 'src/app/core/models/utils/responses/get-unit-by-company-branchOffice';
import { BillingDisableRequest } from 'src/app/core/models/billing/request/billing-disable-request';

@Component({
    selector: 'app-manage-billing',
    templateUrl: './manage-billing.component.html',
    styleUrls: ['./manage-billing.component.scss']
})

export class ManageBillingComponent implements OnInit {

    lBilling: BillingModel[] = []
    lCompany: ParameterModel[] = []
    lUnit: ParameterModel[] = []
    lBranchOffice: ParameterModel[] = []

    formBilling: FormGroup
    message: string

    pageSize = PAGE_SIZE
    totalRows: number
    first: number = 0;

    constructor(
        public dialogService: DialogService,
        public loaderService: LoaderService,
        private _formBuilder: FormBuilder,
        private _messageService: AlertService,
        private _getAllBillings: GetAllBillingsUsecase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getBranchesById: GetBranchOfficeById,
        private _getUnitsById: GetUnitByIdUseCase,
        private _disableBillingById: DisableBillingUsecase
    ) { }

    ngOnInit() {
        this.createFormBilling()
        this.getAllBillings(0)
        this.getAllCompanies()
    }

    createFormBilling() {
        this.formBilling = this._formBuilder.group({
            company_id: [null],
            branch_office_id: [null],
            business_unit_id: [null],
        })
    }

    async getAllBillings(pageNumber: number) {
        try {

            const form = this.formBilling.value;

            const params: BillingSearch = {
                pageNumber: pageNumber + 1,
                pageSize: this.pageSize,
                company_id: form.company_id || 0,
                branch_office_id: form.branch_office_id || 0,
                business_unit_id: form.business_unit_id || 0,
            }

            const data: ResponseData<BillingModel[]> = await this._getAllBillings.execute(params)

            this.lBilling = data.data['results']
            this.totalRows = data.data['total_rows']
            this.message = data.message
        }
        catch (error) {
            console.log("Error: ", error)
            this.lBilling = []
            this.totalRows = 0
            this.message = ''
        }
    }

    async getAllCompanies() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
            this.lCompany = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getBranchOfficeById(id: number) {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getBranchesById.execute(id)
            this.lBranchOffice = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllUnits(idCompany: number,  idBranchOffice: number) {

        try {
            //const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(id)
            const params: GetUnitByCompanyBranchOfficeResponse={idCompany: idCompany, idBranchOffice: idBranchOffice}
            const response: ResponseData<ParameterModel[]> = await this._getUnitsById.execute(params);
            this.lUnit = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async disableBilling(idBilling: number) {
        try {
            const request : BillingDisableRequest={
                id : idBilling,
                user : localStorage.getItem('username')
            }
            const data: ResponseData<number> = await this._disableBillingById.execute(request)

            this._messageService.success(data.message)
            this.getAllBillings(0)
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    getBranches() {
        const companyId = this.formBilling.value.company_id
        const branchOfficeId = this.formBilling.value.branch_office_id
        if (!companyId) return
        this.lBranchOffice = []
        this.lUnit = []
        this.getBranchOfficeById(companyId)
        this.getAllUnits(companyId, branchOfficeId)
    }

    getUnits() {
        const companyId = this.formBilling.value.company_id
        const branchOfficeId = this.formBilling.value.branch_office_id
        if (!branchOfficeId) return
        this.getAllUnits(companyId, branchOfficeId)
    }

    registerBilling() {
        const ref = this.dialogService.open(RegisterBillingComponent, {
            header: 'Registrar Factura',
            width: '75rem',
        });

        ref.onClose.subscribe(() => {
            this.getAllBillings(0)
        })
    }

    onPageChange(event: any) {
        this.first = event.first;
        this.getAllBillings(event.page);
    }

    onChangeCompany() {
        this.formBilling.get('branch_office_id').reset()
        this.formBilling.get('business_unit_id').reset()
        this.getAllBillings(0);
        this.getBranches()
    }

    onChangeBranch() {
        this.formBilling.get('business_unit_id').reset()
        this.getAllBillings(0)
        this.getUnits()
    }

    onChangeUnit() {
        this.getAllBillings(0);
    }
}