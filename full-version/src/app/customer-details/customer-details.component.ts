import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import { ColumnMode } from "@swimlane/ngx-datatable";
import Loan from "../models/loan";
import {} from "@angular/core";
@Component({
  selector: "app-customer-details",
  templateUrl: "./customer-details.component.html",
  styleUrls: ["./customer-details.component.scss"],
})
export class CustomerDetailsComponent implements OnInit {
  // constructor() { }
  public ColumnMode = ColumnMode;

  // ngOnInit(): void {
  // }
  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public httpService: HttpService
  ) {}
  customer: Customer = {} as Customer;
  loans: Loan[];
  async ngOnInit(): Promise<void> {
    await this.getHero();
  }
  async getHero(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.customer = await this.httpService.getCustomerDetail(id);
    this.loans = this.customer.loans;
    console.log(this.customer, this.loans);
    this.chkBoxSelected = [];
    this.cd.detectChanges();
  }

  public chkBoxSelected = [];
  public SelectionType;
  customChkboxOnSelect({ selected }: { selected: Loan[] }) {
    const repayments = selected.map((x) => x.repayments[0]);
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...repayments);
  }
}
