import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { ParamsModel } from 'src/app/core/models/parameter.model';
import { SegmentationRepository } from 'src/app/core/repositories/segmentation.repository';

@Injectable({
    providedIn: 'root'
})
export class SegmentationMockRepository extends SegmentationRepository {
    segmentations = [
        {
            id: 14,
            code: 'CS01',
            description: 'CXC CLIENTES CORPORATIVOS'
        },
        {
            id: 15,
            code: 'CXC CLIENTES CORPORATIVOS',
            description: 'CXC CLIENTES MEDIOS'
        }
    ];

    constructor() {
        super();
    }

    getAllSegmentations(): Observable<ParamsModel> {
        return from(this.segmentations)
    }

}
