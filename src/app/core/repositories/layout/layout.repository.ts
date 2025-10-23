import { MenuValidateRequest } from "../../models/Layout/request/menu-validate.request";
import { MenuRequest } from "../../models/Layout/request/menu.request";
import { MenuResponse } from "../../models/Layout/response/menu.response";
import { ResponseData } from "../../models/response.model";

export abstract class LayoutRepository {
  abstract getMenuByEmail(idLiquidation: MenuRequest): Promise<ResponseData<MenuResponse[]>>

  abstract getMenuValidateByEmail(idLiquidation: MenuValidateRequest): Promise<ResponseData<number>>
}
