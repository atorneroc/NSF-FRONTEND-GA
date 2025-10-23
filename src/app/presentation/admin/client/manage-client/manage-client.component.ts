import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PAGE_SIZE } from 'src/app/common/helpers/constants/pagination.constants';
import { ClientModel } from 'src/app/core/models/client.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { DisableClientUsecase } from 'src/app/core/usecase/client/client/disable-client.usecase';
import { EnableClientUsecase } from 'src/app/core/usecase/client/client/enable-client.usecase';
import { GetAllClientsUsecase } from 'src/app/core/usecase/client/client/get-all-clients.usecase';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { ClientSearch } from '../../../../core/models/client.model';
import { LoaderService } from 'src/app/common/shared/components/loader/loader.service';
import { UpdateClientComponent } from './components/update-client/update-client.component';
import { enter } from 'src/app/common/helpers/animations/enter.animation';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { CompanyName } from 'src/app/common/helpers/enums/companies-name.enum';
import { MsalService } from '@azure/msal-angular';
import { SharedDataUrlService } from 'src/app/common/shared/services/shared-data-url.service';
import { disableClientRequest } from 'src/app/core/models/client/request/disable-client-request';
import { enableClientRequest } from 'src/app/core/models/client/request/enable-client-request';
import { ClientActive, ClientInactive } from 'src/app/common/helpers/constants/client_status.constans';
import { CreditLineStatus } from 'src/app/common/helpers/enums/credit-line-payment-method.enum';
import { BranchService } from 'src/app/core/application/services/branch.service';

@Component({
    selector: 'app-manage-client',
    templateUrl: './manage-client.component.html',
    styleUrls: ['./manage-client.component.scss'],
    animations: [enter]
})

export class ManageClientComponent implements OnInit {

    debounce: any;
    term: string = null;
    viewFilter: boolean = false
    companyName = CompanyName
    formFilterClient: FormGroup

    lClients: ClientModel[] = []
    lTypesClient: ParameterModel[] = []
    lStatusSAP: ParameterModel[] = []
    lStatusCreditLine: ParameterModel[] = []
    lCompany: ParameterModel[] = [];


    clientSelected: ClientModel
    optionsByStatus: any
    options: MenuItem[]

    mensaje: string
    filter = new FormControl()
    selectCompany:number;

    pageNumber = 0;
    pageSizeOptions: number[] = [5, 10, 15,];
    pageSize = PAGE_SIZE;
    totalRows: number;
    first: number = 0;
    apiResponse: JSON;

    constructor(
        public loaderService: LoaderService,
        public dialogService: DialogService,
        private _getAllClients: GetAllClientsUsecase,
        private _confirmationService: ConfirmationService,
        private _formBuilder: FormBuilder,
        private _enableClient: EnableClientUsecase,
        private _disableClient: DisableClientUsecase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _messageService: MessageService,
        private _router: Router,
        private msalService: MsalService,
        private _sharedDataService: SharedDataUrlService,
        private _branchService: BranchService
    ) { }

    ngOnInit() {
        this.createFormFilterClient()
        this.getAllClients(0)
        this.getTypesClient()
        this.getStatusSAP()
        this.getAllCompanies()
        this.setAllOptions()
        this.setOptionsByStatus()
        this.getStatusCreditLine()
        this.actualizarBreadcrumbItems()
    }
    actualizarBreadcrumbItems() {
      const newItems: MenuItem[] = [
        { label: 'Inicio' },
        { label: 'Clientes' },
        { label: 'Buscar clientes' }
      ];
      this._sharedDataService.setBreadcrumbItems(newItems);
    }
    createFormFilterClient() {
        this.formFilterClient = this._formBuilder.group({
            company_id: [null],
            type_client: [null],
            status_credit_line: [null],
            status_sap: [null]
        });
    }

    getName(): string {
      return localStorage.getItem('name')
    }



    registerClient() {
        const ref = this.dialogService.open(RegisterClientComponent, {
            header: 'Crear Cliente',
            width: '80rem',
        });

        ref.onClose.subscribe(() => { this.getAllClients(this.pageNumber) })
    }

    async getClientByTerm(term: any) {
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
            this.term = term.target.value.trim()
            this.getAllClients(0)
        }, 300)
    }

    onPageChange(event) {
        this.first = event.first;
        this.getAllClients(event.page);
    }

    async getAllClients(pageNumber: number, pageSize?: number) {
        try {
            if (pageSize) {
                this.pageSize = pageSize;
            }
            this.pageNumber = pageNumber;

            const form = this.formFilterClient.value

            const params: ClientSearch = {
                pageNumber: pageNumber + 1,
                pageSize: this.pageSize,
                term: this.term || "",
                idCompany: form.company_id || 0,
                idTypeClient: form.type_client || 0,
                idStatusCreditLine: form.status_credit_line || 0,
                idStatusSap: form.status_sap || 0,
                user: localStorage.getItem('access')=="false" ? localStorage.getItem('username') : ''
            }

            this.selectCompany=params.idCompany ?? 0;

            this.lClients = []

            const data: any = await this._getAllClients.execute(params)
            this.lClients = data.data.results
            this.totalRows = data.data.total_rows
            this.mensaje = data.message

        }
        catch (error) {
            console.log("Error: ", error)
            this.lClients = []
            this.totalRows = 0
            this.mensaje = ''
        }
    }

    async getTypesClient() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("13")
            this.lTypesClient = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getStatusSAP() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("20")
            this.lStatusSAP = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getStatusCreditLine() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("23")
            this.lStatusCreditLine = response.data
        }
        catch (error) {
            console.log("Error: ", error)
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

    async disableClient(idClient: number, business_Name: string , id: number) {
        try {
            this._confirmationService.confirm({
                message: `¿Desea inhabilitar al cliente ${business_Name} con ID: ${id}?`,
                accept: async () => {

                    const request : disableClientRequest={
                        id : idClient,
                        user : localStorage.getItem('username')
                    }
                    const data: ResponseData<number> = await this._disableClient.execute(request)
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Operación exitosa' || data.message,
                    });

                    this.getAllClients(this.pageNumber)
                },
                reject: () => {
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'Alerta',
                        detail: 'Se cancelo la operación',
                    });
                }
            })
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async enableClient(idClient: number, business_Name: string , id: number) {
        try {
            this._confirmationService.confirm({
                message:  `¿Desea habilitar al cliente ${business_Name} con ID: ${id}? `,
                accept: async () => {

                    const request : enableClientRequest={
                        id : idClient,
                        user : localStorage.getItem('username')
                    }
                    const data: ResponseData<number> = await this._enableClient.execute(request)
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Operación exitosa' || data.message,
                    });

                    this.getAllClients(this.pageNumber)
                },
                reject: () => {
                    this._messageService.add({
                        severity: 'warn',
                        summary: 'Alerta',
                        detail: 'Se cancelo la operación',
                    });
                }
            })
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    getClientById(idClient: number) {
        this._router.navigate(['/admin/client/' + idClient])
    }

    updateClient(idClient: number) {

        const ref = this.dialogService.open(UpdateClientComponent, {
            header: 'Actualizar Cliente',
            data: idClient,
            width: '80rem',
        });

        ref.onClose.subscribe(() => { this.getAllClients(this.pageNumber) })
    }

    getStatusClient(code_status: string): string {
        const status = code_status as CreditLineStatus;
        return this._branchService.CreditLineCssClass[status] ?? '';
    }

    statusSAP(status: string): string {
        const code = {
            'Migrado':    'component-active',
            'Migrando':   'component-pending',
            'No Migrado': 'component-locked',
        }
        return code[status]
    }

    onPageSizeChange(pageSize?: number) {
        this.pageSize = pageSize
    }

    clearFilterClient(){
        this.formFilterClient.reset()
        this.filter.reset()
        this.term = null
        this.getAllClients(0)
    }

    setAllOptions() {
        this.options = [
            {
                label: 'Información de cliente',
                command: () => { this.getClientById(this.clientSelected.id)}
            },
            {
                label: 'Actualizar cliente',
                command: () => { this.updateClient(this.clientSelected.id) }
            },
            {
                label: 'Inhabilitar cliente',
                command: () => {
                    this.disableClient(this.clientSelected.id, this.clientSelected.business_Name, this.clientSelected.id)
                }
            },
            {
                label: 'Habilitar cliente',
                command: () => {
                    this.enableClient(this.clientSelected.id, this.clientSelected.business_Name, this.clientSelected.id)
                }
            },
        ]
    }

    setOptionsByStatus() {
        this.optionsByStatus = {
            [ClientActive]: [this.options[0], this.options[1], this.options[2]],
            [ClientInactive]: [this.options[0], this.options[3]],
        }
    }

    getOptionsByStatus(client: ClientModel) {
        this.clientSelected = client;

        if (client.status === true) {
          // Si el estado es verdadero (activo)
          this.options = this.optionsByStatus[ClientActive]; // Suponiendo que 'active' es la clave para las opciones de clientes activos
        } else {
          // Si el estado es falso (inactivo)
          this.options = this.optionsByStatus[ClientInactive]; // Suponiendo que 'inactive' es la clave para las opciones de clientes inactivos
        }
    }
}
