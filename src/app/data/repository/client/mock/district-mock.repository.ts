import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { DistrictRepository } from 'src/app/core/repositories/distric.repository';

@Injectable({
  providedIn: 'root',
})
export class DistrictMockRepository extends DistrictRepository {
    
  districts = [
    {
      id: 1,
      code: 'P001',
      description: 'Pucusana',
    },
    {
      id: 2,
      code: 'SB01',
      description: 'San Bartolo',
    },
    {
      id: 3,
      code: 'PH01',
      description: 'Punta Hermosa',
    },
  ];

  constructor() {
    super();
  }

  getAllDistricts(): Observable<ParamsModel> {
    return from(this.districts);
  }
}
