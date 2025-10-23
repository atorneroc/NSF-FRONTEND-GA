import { Component, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CompanyName } from "src/app/common/helpers/enums/companies-name.enum";
import { SharedDataUrlService } from "src/app/common/shared/services/shared-data-url.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  logoScharff=CompanyName.SLI
  constructor(
    private _sharedDataService: SharedDataUrlService
) { }
  ngOnInit(): void {
    this.actualizarBreadcrumbItems()
  }
  actualizarBreadcrumbItems() {
    const newItems: MenuItem[] = [
      { label: 'Inicio' }
    ];
    this._sharedDataService.setBreadcrumbItems(newItems);
  }
  getName(): string {
    return localStorage.getItem('name')
  }
}
