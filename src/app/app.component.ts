import { Component } from '@angular/core';
import { LoaderService } from './common/shared/components/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Scharff.Frontend.Facturacion';

  constructor(
    public loaderService: LoaderService
  ) {   }

  
}
