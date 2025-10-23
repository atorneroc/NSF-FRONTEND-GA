import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home.routing";
import { PrimeNGModule } from "src/app/common/shared/primeng/primeng.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "primeng/api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

const COMPONENTS = [
  HomeComponent

]

@NgModule({
  declarations: [
      COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModule,
      HomeRoutingModule
  ],
})

export class HomeModule { }
