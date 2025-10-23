import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ResponseData } from 'src/app/core/models/response.model';
import { OPERATIONAL_DETAIL_URL } from 'src/app/common/helpers/constants/url.constants';
import { OperationalDetailRepository } from 'src/app/core/repositories/operational-detail/operational-detail.repository';
import { AllOperationalDetailResponse } from 'src/app/core/models/settlement/responses/all-operational-detail.response';
import { RateDetailSearch } from 'src/app/core/models/liquidation.model'
@Injectable({
    providedIn: 'root'
})

export class OperationalDetailWebRepository extends OperationalDetailRepository {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getAllOperationalDetails(params:RateDetailSearch): Promise<ResponseData<AllOperationalDetailResponse[]>> {

        const url = `${OPERATIONAL_DETAIL_URL}`

        const filter = {
          idService: params.idService,
          lstInt: params.lst
        }
        return lastValueFrom(this.http.get<ResponseData<AllOperationalDetailResponse[]>>(url, { params: filter }))
    }

}
