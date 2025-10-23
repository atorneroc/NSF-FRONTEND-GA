import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { CountryRepository } from 'src/app/core/repositories/country.repository';

@Injectable({
  providedIn: 'root',
})
export class CountryMockRepository extends CountryRepository {
    
  countries = [
    {
      id: 1,
      code: 'PE01',
      description: 'Perú',
    },
    {
      id: 2,
      code: 'BO01',
      description: 'Bolivia',
    },
    {
      id: 3,
      code: 'AR01',
      description: 'Argentina',
    },
  ];

  constructor() {
    super();
  }

  getAllCountry(): Observable<ParamsModel> {
    return from(this.countries);
  }
}
