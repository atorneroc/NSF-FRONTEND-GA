import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { AnimateModule } from 'primeng/animate';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { MegaMenuModule } from 'primeng/megamenu';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SkeletonModule } from 'primeng/skeleton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { FileUploadModule } from 'primeng/fileupload';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import {VirtualScrollerModule} from 'primeng/virtualscroller';
import { AutoCompleteModule } from 'primeng/autocomplete';

const COMPONENTS = [
  AnimateModule,
  AccordionModule,
  BadgeModule,
  ButtonModule,
  BreadcrumbModule,
  CalendarModule,
  CardModule,
  CheckboxModule,
  DialogModule,
  InputTextModule,
  InputMaskModule,
  InputNumberModule,
  MegaMenuModule,
  ListboxModule,
  DropdownModule,
  DynamicDialogModule,
  DividerModule,
  PasswordModule,
  TabViewModule,
  MenubarModule,
  TabMenuModule,
  InputTextareaModule,
  ToastModule,
  ConfirmDialogModule,
  PaginatorModule,
  RadioButtonModule,
  SkeletonModule,
  InputSwitchModule,
  TableModule,
  SidebarModule,
  FileUploadModule,
  SlideMenuModule,
  SelectButtonModule,
  SplitButtonModule,
  MenuModule,
  PanelMenuModule,
  TagModule,
  VirtualScrollerModule,
  AutoCompleteModule,
];

@NgModule({
  imports: [COMPONENTS],
  exports: [COMPONENTS],
})
export class PrimeNGModule { }
