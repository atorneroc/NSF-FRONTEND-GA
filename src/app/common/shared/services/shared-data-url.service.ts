import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataUrlService {
  private breadcrumbItems$ = new BehaviorSubject<MenuItem[]>([]);

  getBreadcrumbItems() {
    return this.breadcrumbItems$.asObservable();
  }

  setBreadcrumbItems(items: MenuItem[]) {
    this.breadcrumbItems$.next(items);
  }
}
