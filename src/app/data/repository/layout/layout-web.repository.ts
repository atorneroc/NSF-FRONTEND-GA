import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { SECURITY_URL } from "src/app/common/helpers/constants/url.constants";
import { MenuValidateRequest } from "src/app/core/models/Layout/request/menu-validate.request";
import { MenuRequest } from "src/app/core/models/Layout/request/menu.request";
import { MenuResponse } from "src/app/core/models/Layout/response/menu.response";
import { ResponseData } from "src/app/core/models/response.model";
import { LayoutRepository } from "src/app/core/repositories/layout/layout.repository";

@Injectable({
  providedIn: 'root'
})

export class LayoutWebRepository extends LayoutRepository {

  constructor(
      private http: HttpClient
  ) {
      super();
  }

  getMenuByEmail(request: MenuRequest): Promise<ResponseData<MenuResponse[]>> {
      const url = `${SECURITY_URL}/menubyuser`
      const filter = {
        user_email: request.user_email
      }
      return lastValueFrom(this.http.get<ResponseData<MenuResponse[]>>(url, { params: filter }))
  }

  getMenuValidateByEmail(request: MenuValidateRequest): Promise<ResponseData<number>> {
      const url = `${SECURITY_URL}/verifymenubyuser?user_email=${request.user_email}&route=${request.route}`
      const filter = {
        user_email: request.user_email,
        route : request.route
      }
      return lastValueFrom(this.http.get<ResponseData<number>>(url))
  }
}
