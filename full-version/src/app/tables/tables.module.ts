import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TablesRoutingModule } from "./tables-routing.module";

import { ExtendedTableComponent } from "./extended/extended-table.component";
import { BasicComponent } from "./basic/basic.component";
import { TablesComponent } from "./angular/tables.component";
import { NgbdSortableHeader } from "./angular/sortable.directive";
import { MainTableComponent } from "app/main-table/main-table.component";
import { CustomerDetailsComponent } from "app/customer-details/customer-details.component";
import { MyPaginationComponent } from "app/my-pagination/my-pagination.component";
import { EditCustomerComponent } from "app/edit-customer/edit-customer.component";
import { HomeComponent } from "../home/home.component";
import { UserTableComponent } from "app/user-table/user-table.component";
import { LoanTableComponent } from "app/loan-table/loan-table.component";
import { LoanDetailsComponent } from "app/loan-details/loan-details.component";
import { EditUserComponent } from "../edit-user/edit-user.component";
import { PluckPipe } from "app/main-table/blacklistpipe";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgSelectModule } from "@ng-select/ng-select";
import { GobackbuttonComponent } from "../gobackbutton/gobackbutton.component";
import { BackButtonDirective } from "../joseph/backButtonDirective";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TablesRoutingModule,
    NgxDatatableModule,
    NgSelectModule,
  ],
  declarations: [
    PluckPipe,
    ExtendedTableComponent,
    BasicComponent,
    TablesComponent,
    NgbdSortableHeader,
    MyPaginationComponent,
    GobackbuttonComponent,
    HomeComponent,
    BackButtonDirective,
    //customer
    MainTableComponent,
    CustomerDetailsComponent,
    EditCustomerComponent,
    //user
    UserTableComponent,
    // CreateNewUserComponent,
    EditUserComponent,

    //loan
    LoanTableComponent,
    LoanDetailsComponent,
  ],
})
export class TablesModule {}
