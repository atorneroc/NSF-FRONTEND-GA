import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { PAGE_SIZE } from 'src/app/common/helpers/constants/pagination.constants';
import { LoaderService } from '../../../../common/shared/components/loader/loader.service';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { GetParameterByIdUseCase } from '../../../../core/usecase/utils/get-parameter-by-id.usecase';
import { UpdateCreditLineComponent } from './components/update-credit-line/update-credit-line.component';
import { RegisterCreditLineComponent } from './components/register-credit-line/register-credit-line.component';
import { CreditLineModel, CreditLineSearch } from 'src/app/core/models/credit-line.model';
import { GetAllCreditLineUseCase } from 'src/app/core/usecase/credit-line/get-all-credit-line.usecase';
import { ClientModel } from 'src/app/core/models/client.model';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { creditLineAnimation } from './manage-credit-line.animation';
import { DebounceUtil } from 'src/app/common/helpers/utils/debounce.util';
import { AdditionalData } from 'src/app/core/models/common/response/paginated.response';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { CompanyName } from '../../../../common/helpers/enums/companies-name.enum';
import { MenuItem } from 'primeng/api';
import { SharedDataUrlService } from 'src/app/common/shared/services/shared-data-url.service';
import { MsalService } from '@azure/msal-angular';
import { GenerateReportComponent } from './components/generate-report/generate-report.component';
import { DetailsConsumptionComponent } from './components/details-consumption/details-consumption.component';
import { DownloadReportConsumoExcelRequest } from 'src/app/core/models/credit-line/request/downlodad-reportconsumo-excel.request';
import saveAs from 'save-as';
import { DownloadReportConsumeExcelUseCase } from 'src/app/core/usecase/credit-line/download-reportconsume-excel.usecase';

@Component({
    selector: 'app-manage-credit-line',
    templateUrl: './manage-credit-line.component.html',
    styleUrls: ['./manage-credit-line.component.scss'],
    animations: [creditLineAnimation]
})

export class ManageCreditLineComponent implements OnInit {

    filter= new FormControl();
    idCreditLine: number
    term: string = null;
    pageSize = PAGE_SIZE;
    pageNumber = 0;
    totalRows: number;
    first: number = 0;
    mensaje: string;
    isVisibleFilterCreditLine = false;
    pageSizeOptions: number[] = [5, 10, 15];
    message: string;
    creditLineSelected: CreditLineModel;
    options: MenuItem[]
    optionsById: any

    CompanyName = CompanyName;

    formCreditLine: FormGroup;
    lCreditLine: CreditLineModel[] = [];
    lCLient: ClientModel[] = [];
    Id_State: ParameterModel[] = [];
    companies: ParameterModel[] = [];
    modality_id: ParameterModel[] = [];
    currency: ParameterModel[] = [];
    additional_data: AdditionalData;
    newItems: MenuItem[] = []

    constructor(
        public dialogService: DialogService,
        public loaderService: LoaderService,
        private _getAllCreditLine : GetAllCreditLineUseCase,
        private _getParameterById: GetParameterByIdUseCase,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _formBuilder: FormBuilder,
        private _getAllStatus: GetParameterByIdUseCase,
        private _getAllModalities: GetParameterByIdUseCase,
        private _alertService: AlertService,
        private _sharedDataService: SharedDataUrlService,
        private msalService: MsalService,
        private _downLoadReport: DownloadReportConsumeExcelUseCase,
    ) { }

    ngOnInit() {
        this.createForm();
        this.getAllCreditLine(0);
        this.getAllCompanies();
        this.getAllModalities();
        this.getAllCoins();
        this.setAllOptions();
        this.getAllStatusCreditLine();
        this.actualizarBreadcrumbItems();
    }
    actualizarBreadcrumbItems() {
      this.newItems = [
        { label: 'Inicio' },
        { label: 'Línea de crédito' },
        { label: 'Buscar línea de crédito' }
      ];
      this._sharedDataService.setBreadcrumbItems(this.newItems);
    }
    getName(): string {
        return localStorage.getItem('name')
    }
    createForm() {
        this.formCreditLine = this._formBuilder.group({
            company_id: [null],
            modality_id: [null],
            Id_Money: [null],
            Id_State: [null],
        });
    }

    async getAllCompanies() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
            this.companies = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllModalities() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("22")
            this.modality_id = response.data
            this.modality_id.sort((a, b) => a.attribute_length - b.attribute_length);
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllCoins() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getParameterById.execute("1")
            this.currency = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getAllStatusCreditLine() {

        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllStatus.execute("23")
            this.Id_State = response.data
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }

    async getClientByTerm() {
        DebounceUtil.apply(() => {
            this.getAllCreditLine(0)
        })
    }

    async getAllCreditLine(pageNumber: number, pageSize?: number) {
        try {
            if (pageSize) {
                this.pageSize = pageSize;
            }
            this.pageNumber = pageNumber;

            const form = this.formCreditLine.value;
            const params: CreditLineSearch = {
                pageNumber: pageNumber + 1,
                pageSize: this.pageSize,
                term: this.filter.value || "",
                idclient:  0,
                Id_Company: form.company_id || 0,
                Id_Modality: form.modality_id || 0,
                Id_Money: form.Id_Money || 0,
                Id_State: form.Id_State || 0,
                user: localStorage.getItem('access')=="false" ? localStorage.getItem('username') : ''
            }

            const data: any = await this._getAllCreditLine.execute(params)
            this.lCreditLine = data.data.results
            this.totalRows = data.data.total_rows
            this.mensaje = data.message
            this.message = data.message
        }
        catch (error) {
            console.log('Error: ', error);
            //this._alertService.error(error.error.Error[0])
            this.lCreditLine = []
            this.totalRows = 0
            this.mensaje = ''
        }
    }

    getStatusToCreditLine(code_status: string): string {
        try {
            const codeDiccionary = {
                'SCL02': () => 'component-active',
                'SCL03': () => 'component-locked',
                'SCL01': () => 'component-overdrawn',
                'SCL04': () => 'component-counted',
                'SCL05': () => 'component-active',
                'SCL06': () => 'component-locked',
                'SCL07': () => 'component-locked',
            }
            return codeDiccionary[code_status]()
        }
        catch (error) {
            return ''
        }
    }

    clearFilterCreditLine() {
        this.filter.reset()
        this.formCreditLine.reset()
        this.term = null
        this.getAllCreditLine(0);
    }

    onPageSizeChange(pageSize?: number) {
        this.pageSize = pageSize
    }

    showModalRegisterCreditLine() {
        const ref = this.dialogService.open(RegisterCreditLineComponent, {
            header: 'Crear Línea de Crédito',
            width: '80rem',
        });

        ref.onClose.subscribe(() => {
            this.getAllCreditLine(this.pageNumber)
        })
    }

    showModalUpdateCreditLine(creditLineId: number) {
        const data = creditLineId;
        const ref = this.dialogService.open(UpdateCreditLineComponent, {
            header: 'Actualizar Línea de crédito',
            data: { id_CreditLine: creditLineId},
            width: '80rem',
        });

        ref.onClose.subscribe(() => {
            this.getAllCreditLine(this.pageNumber)
        })
    }

    setCreditLine(CreditLine: CreditLineModel) {
        this.creditLineSelected = CreditLine
    }


    setAllOptions() {
        this.options = [
            {
                label: 'Actualizar línea de credito',
                command: () => {this.showModalUpdateCreditLine(this.creditLineSelected.id_CreditLine)}
            },
            {
                label: 'Ver Detalle Consumo',
                command: () => {this.showModalDetailsConsume(this.creditLineSelected)}
            },
                        {
                label: 'Reporte Detallado Consumo LC',
                command: () => {this.DownloadReportExcelConsumo(this.creditLineSelected)}
            }
        ]
    }

      async DownloadReportExcelConsumo(creditLine: any) {
        console.log(creditLine)
        const data : DownloadReportConsumoExcelRequest = {
    
          id_company : creditLine.id_Company ?? 0,
          id_status : 0,
          id_cliente: creditLine.id_Cliente,
          id_moneda : 1,
          id_CreditLine : creditLine.id_CreditLine ?? 0
        }
    
          const response = await this._downLoadReport.execute(data)
    
    
          if(response.blob === null)   {
            this._alertService.error('No se encontraron datos.')
            return
          }
          this._alertService.success('El documento se genero correctamente')
    
          const contentType: string = 'text/plain';
          const file = new Blob([response.blob], { type: contentType });
    
          saveAs(file, response.fileName);
          
       }

    // MODAL GENERAR REPORTE
    generateReportModal() {
      const ref = this.dialogService.open(GenerateReportComponent, {
          header:`Ver Reporte`,
          width: '50rem',
          data: {
          }

      });
    }

    showModalDetailsConsume(creditLine: any) {
        const labelHeader = creditLine.client_Name + ' ' + creditLine.client_Document_Type+':'+ creditLine.client_document_number
        const ref = this.dialogService.open(DetailsConsumptionComponent, {
            header: labelHeader,
            data: { CreditLine: creditLine.id_CreditLine},
            width: '70rem',
            contentStyle: { 'white-space': 'normal' },
        });

        ref.onClose.subscribe(() => {
            this.getAllCreditLine(this.pageNumber)
        })
    }
}
