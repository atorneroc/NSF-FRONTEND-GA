import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { SERVICE_URL } from 'src/app/common/helpers/constants/url.constants';
import { ServiceRepository } from 'src/app/core/repositories/service/service.repository';
import { AllServiceResponse } from 'src/app/core/models/settlement/responses/all-service.response';
import { RateServiceSearch} from 'src/app/core//models/liquidation.model';
@Injectable({
    providedIn: 'root'
})

export class ServiceWebRepository extends ServiceRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getAllServices(params: RateServiceSearch): Promise<ResponseData<AllServiceResponse[]>> {

        const url = `${SERVICE_URL}`

        const filter = {
          idBase:params.idBaseStructure,
          lsIdService: params.lstIdServicesAdded,
        }

        return lastValueFrom(this.http.get<ResponseData<AllServiceResponse[]>>(url, { params: filter }))
    }

}
