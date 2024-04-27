import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BasicComponent } from "./basic/basic.component";
import { ExtendedTableComponent } from "./extended/extended-table.component";
import { TablesComponent } from "./angular/tables.component";
import { MainTableComponent } from "app/main-table/main-table.component";
import { UserTableComponent } from "app/user-table/user-table.component";
import { CustomerDetailsComponent } from "app/customer-details/customer-details.component";
import { EditCustomerComponent } from "app/edit-customer/edit-customer.component";
import { LoanTableComponent } from "app/loan-table/loan-table.component";
import { LoanDetailsComponent } from "app/loan-details/loan-details.component";
import { HomeComponent } from "../home/home.component";
import { EditUserComponent } from "../edit-user/edit-user.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "basic",
        component: BasicComponent,
        data: {
          title: "Basic Table",
        },
      },
      {
        path: "extended",
        component: ExtendedTableComponent,
        data: {
          title: "Extended Table",
        },
      },
      {
        path: "tables",
        component: TablesComponent,
        data: {
          title: "Angular Table",
        },
      },
      {
        path: "mainTable",
        component: MainTableComponent,
        data: {
          title: "Main Table",
        },
      },
      {
        path: "home",
        component: HomeComponent,
        data: {
          title: "Home",
        },
      },
      {
        path: "userTable",
        component: UserTableComponent,
        data: {
          title: "User Table",
        },
      },
      {
        path: "user/:id/edit",
        component: EditUserComponent,
        data: {
          title: "Edit User",
        },
      },
      {
        path: "customerDetails/:id",
        component: CustomerDetailsComponent,
        data: {
          title: "CustomerDetails",
        },
      },
      {
        path: "customerDetails/:id/edit",
        component: EditCustomerComponent,
        data: {
          title: "Edit Customer",
        },
      },
      {
        path: "loanTable",
        component: LoanTableComponent,
        data: {
          title: "Loan Table",
        },
      },
      {
        path: "loanDetails/:id",
        component: LoanDetailsComponent,
        data: {
          title: "LoanDetails",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule {}
