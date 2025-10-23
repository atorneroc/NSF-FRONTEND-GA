import { Injectable } from "@angular/core";
import { UseCasePromise } from "../../base/use-case-promise";
import { MenuRequest } from "../../models/Layout/request/menu.request";
import { MenuResponse } from "../../models/Layout/response/menu.response";
import { ResponseData } from "../../models/response.model";
import { LayoutRepository } from "../../repositories/layout/layout.repository";

@Injectable({
  providedIn: 'root'
})

export class GetMenuByEmailUseCase implements UseCasePromise<MenuRequest, MenuResponse[]> {

  constructor(
      private _layoutRepository: LayoutRepository
  ) { }

  execute(request: MenuRequest): Promise<ResponseData<MenuResponse[]>> {

      return this._layoutRepository.getMenuByEmail(request)
  }
}
