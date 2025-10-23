import { ResponseData } from '../../models/response.model';
import { AllOperationalDetailResponse } from '../../models/settlement/responses/all-operational-detail.response';
import {RateDetailSearch} from '../../models/liquidation.model'
export abstract class OperationalDetailRepository {

    abstract getAllOperationalDetails(params:RateDetailSearch): Promise<ResponseData<AllOperationalDetailResponse[]>>

}
