import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { AlertService } from "src/app/common/shared/services/alert.service";
import { ValidateInputService } from "src/app/common/shared/services/validate-input.service";
import { DownloadReportExcelRequest } from "src/app/core/models/credit-line/request/downlodad-report-excel.request";
import { ParameterModel } from "src/app/core/models/parameter.model";
import { ResponseData } from "src/app/core/models/response.model";
import { ParameterResponse } from "src/app/core/models/utils/responses/parameter.response";
import { DownloadReportExcelUseCase } from "src/app/core/usecase/credit-line/download-report-excel.usecase";
import { GetAllCompaniesUseCase } from "src/app/core/usecase/utils/get-all-companies.usecase";
import { GetParameterByIdUseCase } from "src/app/core/usecase/utils/get-parameter-by-id.usecase";
import saveAs from 'save-as';
import { BranchService } from "src/app/core/application/services/branch.service";
import { invalid } from "src/app/common/helpers/constants/alert.constants";
@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})


export class GenerateReportComponent implements OnInit {


  reportForm: FormGroup
  companyList : ParameterModel[] = [];
  statusCreditLineList : ParameterModel[] = [];
  typeCreditLineList : ParameterModel[] = [];
  monedaCreditLineList : ParameterModel[] = [];

  clientList: any[] = [];
  isGetClientByFilterActive: boolean = false;

  constructor(
    private _fb:FormBuilder ,
    private _alertService: AlertService,
    private _dialogRef: DynamicDialogRef,
    public validateService: ValidateInputService,
    private _getAllcompanies: GetAllCompaniesUseCase,
    private _downLoadReport: DownloadReportExcelUseCase,
    private _branchService: BranchService,
  ){}

  ngOnInit() {
    this.createForm();
    this.getAllCompanies();
    this.getAllStatusCreditLine();
    this.getAllTypeCreditLine();
    this.getAllMonedaCreditLine();
  }
  createForm() {
    this.reportForm = this._fb.group({
      company: [null],
      statusCreditLine: [null],
      typeCreditLine: [null, Validators.required],
      monedaCreditLine: [null],
      client_id:[null],
    })
  }



  async getAllCompanies() {

    try {
        const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute()
        this.companyList = response.data
    }
    catch (error) {
        console.log("Error: ", error)
    }
  }

  async getAllStatusCreditLine() {
      this.statusCreditLineList = await this._branchService.loadParameterList("23");
  }

  async getAllTypeCreditLine() {
      this.typeCreditLineList = await this._branchService.loadParameterList("TIPOREPCREDITO");
  }

  async getAllMonedaCreditLine() {
      this.monedaCreditLineList = await this._branchService.loadParameterList("1");
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


  async DownloadReportExcel() {

    if (this.reportForm.invalid) {
        this._alertService.warn(invalid)
        this.reportForm.markAllAsTouched()
        return
    }

    const form = this.reportForm.value;
    const tipo = this.typeCreditLineList.find(item => item.id == form.typeCreditLine).detail_code;
    const data : DownloadReportExcelRequest = {

      id_company :  form.company ?? 0,
      id_status : form.statusCreditLine ?? 0,
      id_cliente: form.client_id?.id ?? 0,
      id_moneda : form.monedaCreditLine ?? 0,
      id_tipo_reporte: tipo ?? '',
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


    // CIERRA MODAL
    closeModal() {
      this._dialogRef.close()
  }

}


