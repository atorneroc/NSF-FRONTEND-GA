import { ResponseData } from '../../models/response.model';
import { AllServiceResponse } from '../../models/settlement/responses/all-service.response';
import { RateServiceSearch } from '../../models/liquidation.model';
export abstract class ServiceRepository {

    abstract getAllServices(filter: RateServiceSearch): Promise<ResponseData<AllServiceResponse[]>>

}
