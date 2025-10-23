import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageError } from 'src/app/common/validator/error-message';
import { ParameterModel } from 'src/app/core/models/parameter.model';
import { ResponseData } from 'src/app/core/models/response.model';
import { ValidateInputService } from 'src/app/common/shared/services/validate-input.service';
import { GetAllCompaniesUseCase } from 'src/app/core/usecase/utils/get-all-companies.usecase';
import { GetProductByCompanyBusinessUnitRequest } from 'src/app/core/models/utils/request/get-business-unit-by-company.request';
import { GetProductByCompanyBusinessUnitResponse } from 'src/app/core/models/utils/responses/get-product-by-company-business-unit.response';
import { GetBusinessUnitByCompanyResponse } from 'src/app/core/models/utils/responses/get-business-unit-by-company.model';
import { GetProductByCompanyBusinessUnitUseCase } from 'src/app/core/usecase/utils/get-product-by-company-business-unit.usecase';
import { GetUnitByCompanyUseCase } from 'src/app/core/usecase/utils/get-unit-by-company.usecase';
import { GetParameterByIdUseCase } from 'src/app/core/usecase/utils/get-parameter-by-id.usecase';
import { RegisterBillingCutsUsecase } from 'src/app/core/usecase/client/billing-cut/register-billing-cut.usecase';
import { BillingCutDetailDto, RegisterBillingCut } from 'src/app/core/models/billing-cut.model';
import { UpdateBillingCutsUsecase } from 'src/app/core/usecase/client/billing-cut/update-billing-cut.usecase';
import { CutsClientEstadoRequest } from 'src/app/core/models/client/request/couts-client-status.request';
import { AutomaticResponse } from 'src/app/core/models/client/responses/automatic.response';
import { UpdateCutsClientsEstadoUsecase } from 'src/app/core/usecase/client/billing-cut/update-cuts-clients-estado.usecase';
import { AlertService } from 'src/app/common/shared/services/alert.service';
import { BillingCutEmpresa, BillingCutUnidad } from 'src/app/common/helpers/enums/client-billing-cut.enum';
import { BranchService } from 'src/app/core/application/services/branch.service';

@Component({
    selector: 'app-register-billing-cut',
    templateUrl: './register-billing-cut.component.html',
    styleUrls: ['./register-billing-cut.component.scss']
})
export class RegisterBillingCutComponent implements OnInit {
    formBillingCut: FormGroup;
    companies: ParameterModel[] = [];
    cut_detail: FormArray = this._formBuilder.array([]);
    courts: ParameterModel[] = [];
    businessUnits: GetBusinessUnitByCompanyResponse[] = [];
    selectedProducts: number[] = [];
    unitLists: GetBusinessUnitByCompanyResponse[][] = [];
    private productCache: Map<string, GetProductByCompanyBusinessUnitResponse[]> = new Map();

    contactList: any[] = [];
    otherData: any;
    optionModule: any;

    constructor(
        private _formBuilder: FormBuilder,
        private _confirmationService: ConfirmationService,
        public validateService: ValidateInputService,
        private _dialogRef: DynamicDialogRef,
        private _config: DynamicDialogConfig,
        private _messageService: MessageService,
        private _messageError: MessageError,
        private _getAllcompanies: GetAllCompaniesUseCase,
        private _getProductByCompanyBusinessUnitUseCase: GetProductByCompanyBusinessUnitUseCase,
        private _getUnitByCompany: GetUnitByCompanyUseCase,
        private _getAllModalities: GetParameterByIdUseCase,
        private _cdr: ChangeDetectorRef,
        private _registerBillingCuts: RegisterBillingCutsUsecase,
        private _updateBillingCuts: UpdateBillingCutsUsecase,
        private _service : BranchService,
    ) { }

    async ngOnInit() {

        this.createFormClient();
        await Promise.all([
            this.getAllCompanies(),
            this.getAllCourts()
        ]);
        this.initFormDetailCourtData();

        const passedData = this._config?.data;
        if (passedData && Object.keys(passedData).length > 0) {
            this.contactList = passedData.contactList ?? [];
            this.otherData = passedData;
            this.optionModule = passedData.type;
            if(passedData.idEmpresa != 0 && passedData.type){
                await this.getCutsUpdate(passedData.idEmpresa);
            }
        } else {
            console.warn('No se recibieron datos en el diálogo');
            this.contactList = [];
        }
    }

    createFormClient() {
        this.cut_detail = this._formBuilder.array([]);
        this.formBillingCut = this._formBuilder.group({
            id_Company: [null, Validators.required],
            cut_detail: this.cut_detail
        });
    }

    async getAllCompanies() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllcompanies.execute();
            this.companies = response.data;
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    }

    async getAllCourts() {
        try {
            const response: ResponseData<ParameterModel[]> = await this._getAllModalities.execute("TCORFAC");
            this.courts = response.data;
        } catch (error) {
            console.error('Error al cargar cortes de facturación:', error);
        }
    }

    initFormDetailCourtData() {
        // Agregar un registro vacío
        const form = this._formBuilder.group({
            id_business_unit: [null],
            id_product: [null],
            id_court: [null],
            productsList: [[]],
            isPreloaded: [false],
            status: [true]
        });

        this.cut_detail.push(form);
    }


    initFormDetailCourt() {
        this.cut_detail = this._formBuilder.array([])
        this.initFormDetailCourtData();
    }

    getDetailCourtForm(form) {
        return form as FormGroup;
    }

    get DetailCourtDataArray() {
        return this.cut_detail as FormArray;
    }

    async onChangeCompany(id_Company: number) {
        try {
            this.initFormDetailCourt()
            if (id_Company != null) {
                const response: ResponseData<GetBusinessUnitByCompanyResponse[]> =
                    await this._getUnitByCompany.execute(id_Company);
                this.businessUnits = response.data;
            }

        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async onChangeBusinessUnit(id_Business_Unit: number, cutIndex: number) {
        
        try {
            const form = this.formBillingCut.getRawValue();
            if (id_Business_Unit != null) {
                let request: GetProductByCompanyBusinessUnitRequest = {
                    Id_Business_Unit: id_Business_Unit,
                    Id_Company: form.id_Company
                }
                const response: ResponseData<GetProductByCompanyBusinessUnitResponse[]> =
                    await this._getProductByCompanyBusinessUnitUseCase.execute(request);

                const specificForm = this.cut_detail.at(cutIndex) as FormGroup;
                specificForm.get('productsList').setValue(response.data);

                this._service.aplicarRegla(form.id_Company, id_Business_Unit, specificForm, 'id_product');
            }

        } catch (error) {
            console.log('Error: ', error);
            //this.isDisableAddButton = true
        }
    }

    registerDetail(position?: number) {

        const form = this._formBuilder.group({
            id_business_unit: [null],
            id_product: [null],
            id_court: [null],
            index: [position],
            productsList: [[]],
            isPreloaded: [false],
            status: [true]
        });

        this.cut_detail.push(form);

    }

    async registerBillingCut() {
        
        if (this.formBillingCut.invalid) {
            this._messageError.show(this.formBillingCut, true, 'invalid');
            return;
        }

        const companyId = this.formBillingCut.get('id_Company').value;
        this.cut_detail.controls.forEach((group: FormGroup) => {
            this._service.aplicarCutDetailValidacion(companyId, group);
        });

        if (this.cut_detail.invalid) {
            this._messageError.show(this.cut_detail, true, 'invalid');
            return;
        }

        if(!this.optionModule){

            const empresa = this.contactList.find(c => c.id_Company === companyId);
            if (empresa && Array.isArray(empresa.billignCuts) && empresa.billignCuts.length > 0) {
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Empresa con registros existentes',
                    detail: 'Esta empresa ya tiene unidades de negocio asignadas. No puede registrar nuevos cortes.'
                });
                return;
            }
        }

        // Obtener los detalles manualmente desde los controles del FormArray
        const cutDetails = [];
        for (let i = 0; i < this.cut_detail.length; i++) {
            const detailControl = this.cut_detail.at(i) as FormGroup;
            cutDetails.push({
                id: detailControl.get('id')?.value ?? 0,
                id_business_unit: detailControl.get('id_business_unit').value,
                id_product: detailControl.get('id_product').value,
                id_court: detailControl.get('id_court').value,
                productsList: detailControl.get('productsList').value,
                status: detailControl.get('status').value
            });
        }
        
        // Filtrar solo los registros que tienen unidad de negocio y corte de facturación
        const validDetails = cutDetails.filter(detail => {
            return detail.id_business_unit !== null &&
                detail.id_business_unit !== undefined &&
                detail.id_business_unit !== '' &&
                detail.id_court !== null &&
                detail.id_court !== undefined &&
                detail.id_court !== '';
        });

        // Mapear solo los registros válidos al formato requerido
        const billingCutDetails: BillingCutDetailDto[] = validDetails.map(detail => {
            return {
                id: detail.id ?? 0,
                id_BusinessUnit: detail.id_business_unit,
                id_Product: detail.id_product, // Puede ser null
                id_BillingCut_Type: detail.id_court,
                creation_User: localStorage.getItem('username') || '',
                status:detail.status
            };
        });
    
        const billingCuts: RegisterBillingCut = {
            id_Client: Number(this._config.data.idClient),
            id_Company: Number(this.formBillingCut.get('id_Company').value),
            lstBillingCut: billingCutDetails
        };
        
        try {
            let response;
            if(!this.optionModule){
                 response = await this._registerBillingCuts.execute(billingCuts);
            }else{
                response = await this._updateBillingCuts.execute(billingCuts);
            }
            
            this._messageService.add({
                severity: 'success',
                summary: 'Registrado!',
                detail: response.message || 'Cortes de facturación registrados correctamente'
            });
    
            this.close();
        } 
        catch (error) {
            console.log(error)
        }
    }

    removeDetail(index: number): void {
        if (this.cut_detail.length === 0) return;

        const formGroup = this.cut_detail.at(index);
        const id = formGroup.get('id')?.value;

        const shouldRemove = !id || !this.optionModule;

        if (shouldRemove) {
            this.cut_detail.removeAt(index);
            return;
        }

        this.deactivateDetail(formGroup);
    }

    private deactivateDetail(formGroup: AbstractControl): void {

        const fieldsToDisable = ['id_court'];
        const statusField = 'status';

        fieldsToDisable.forEach(field => formGroup.get(field)?.disable());
        formGroup.get(statusField)?.setValue(false);

        formGroup.markAsTouched();
        formGroup.updateValueAndValidity();
    }
    
    activateDetail(index: number) {
        if (this.cut_detail.length > 0) {
            const formGroup = this.cut_detail.at(index);
            formGroup.get('id_court')?.enable();
            formGroup.get('status')?.setValue(true);
        }
    }

    close() {
        this._dialogRef.close();
    }

    validate(control: string) {
        if (this.formBillingCut.controls[control].touched) {
            if (this.formBillingCut.controls[control].errors) return 'ng-invalid ng-dirty';
            else return 'border-success';
        }
        else return '';
    }

    onCutBillingChange(currentControl: AbstractControl): void {
         setTimeout(() => {
            this.checkDuplicateAndRemove(currentControl);
        });
    }

    onProductChange(event: any, currentControl: AbstractControl): void {
        setTimeout(() => {
            this.checkDuplicateAndRemove(currentControl);
        });
    }

    checkDuplicateAndRemove(currentControl: AbstractControl): void {
        const selectedProductId = currentControl.get('id_product')?.value;
        const selectedBusinessUnitId = currentControl.get('id_business_unit')?.value;
            
        // Verifica si hay un duplicado
        const isDuplicate = this.cut_detail.controls
            .filter(control => control !== currentControl)
            .some(control => {
                const detail = control.value;
                const unit = control.get('id_business_unit')?.value
                const prod = control.get('id_product')?.value

                  return Number(unit) === Number(selectedBusinessUnitId) &&
                   Number(prod) === Number(selectedProductId);
            });

        if (isDuplicate && !currentControl.get('isPreloaded')?.value) {
            const index = this.cut_detail.controls.indexOf(currentControl);
            this.removeDetail(index);

            this._messageService.add({
                severity: 'warn',
                summary: 'Producto duplicado',
                detail: 'Ya se ha registrado este producto en la misma unidad de negocio.'
            });
        }
    }

    async getCutsUpdate(idEmpresa: number) {
        
        const empresa = this.contactList.find(item => item.id_Company === idEmpresa);
        await this.onChangeCompany(empresa.id_Company);

        if (!empresa) {
            return;
        }

        this.formBillingCut.get('id_Company').setValue(empresa.id_Company);
        this.formBillingCut.get('id_Company').disable();
        this.cut_detail.clear();

        for (const [cutIndex, corte] of empresa.billignCuts.entries()) {
            const formGroup = this._formBuilder.group({
                id: [corte.id],
                id_business_unit: [corte.id_BusinessUnit, Validators.required],
                id_product: [corte.id_Product, Validators.required],
                id_court: [corte.id_BillingCut_Type, Validators.required],
                productsList: [[]],
                isPreloaded: [true],
                status: [corte.status]
            });
            if (corte.status === false) {
                formGroup.get('id_court')?.disable();
            }
            this.cut_detail.push(formGroup);
            await this.onChangeBusinessUnit(corte.id_BusinessUnit, cutIndex);

            formGroup.get('id_business_unit')?.disable(); 
            formGroup.get('id_product')?.disable(); 
            formGroup.get('id_Company')?.disable(); 
        }
    }

    async onClearCompany(id: number){
        const numero = Number(id);
        if (isNaN(numero)) {
            this.businessUnits = null;
            this.formBillingCut.get('id_business_unit').setValue('');
            this.formBillingCut.get('id_product').setValue('');
            this.formBillingCut.get('id_product')?.reset();
        }
    }

    async onClearBusinessUnit(cutIndex: number) {
        const specificForm = this.cut_detail.at(cutIndex) as FormGroup;
          specificForm.get('id_business_unit')?.reset();
          specificForm.get('id_product')?.reset();
          specificForm.get('productsList')?.setValue([]);
    }
}