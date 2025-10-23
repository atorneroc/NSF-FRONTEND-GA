import { Injectable } from "@angular/core";
import { UseCasePromise } from "../../base/use-case-promise";
import { MenuRequest } from "../../models/Layout/request/menu.request";
import { LayoutRepository } from "../../repositories/layout/layout.repository";
import { MenuValidateRequest } from "../../models/Layout/request/menu-validate.request";
import { ResponseData } from "../../models/response.model";

@Injectable({
  providedIn: 'root'
})

export class GetMenuValidateByEmailUseCase implements UseCasePromise<MenuRequest,number> {

  constructor(
      private _layoutRepository: LayoutRepository
  ) { }

  execute(request: MenuValidateRequest): Promise<ResponseData<number>> {

      return this._layoutRepository.getMenuValidateByEmail(request)
  }
}
