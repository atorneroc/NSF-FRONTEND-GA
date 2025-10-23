import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { ProvinceRepository } from 'src/app/core/repositories/province.repository';

@Injectable({
  providedIn: 'root',
})
export class ProvinceMockRepository extends ProvinceRepository {
    
  provinces = [
    {
      id: 1,
      code: 'LM',
      description: 'Lima',
    },
    {
      id: 2,
      code: 'C001',
      description: 'Callao',
    },
    {
      id: 3,
      code: 'h001',
      description: 'Huaral',
    },
  ];

  constructor() {
    super();
  }

  getAllProvinces(): Observable<ParamsModel> {
    return from(this.provinces);
  }
}
