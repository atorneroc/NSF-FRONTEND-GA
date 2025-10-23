import { ResponseData } from "../models/response.model";

export interface UseCasePromise<S, T> {

    execute(params: S): Promise<ResponseData<T>>;

}