import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import Loan from "app/models/loan";
import Repayment from "../models/repayment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: [
    "./home.component.scss",
    "../../assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  todayLoansCurrentPage = 0;
  tomorrowLoansCurrentPage = 0;
  itemsPerPage = 10;
  todayLoansTotalItems = 0;
  tomorrowLoansTotalItems = 0;
  tomorrowLoans: Loan[] = [];
  todayLoans: Loan[] = [];
  public ColumnMode = ColumnMode;
  constructor(
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    public httpService: HttpService,
    private modalService: NgbModal
  ) {}

  // row data
  now = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  async getRepayments() {
    const todayLoansResult = await this.httpService.getTodayLoans(
      this.todayLoansCurrentPage,
      this.itemsPerPage
    );
    this.todayLoans = todayLoansResult[0];
    this.todayLoansTotalItems = todayLoansResult[1];
    this.todayLoans.forEach((x) => {
      x.paidRepaymentCount = x.repayments.filter((x) => x.isPaid).length;
    });
    const tomorrowLoansResult = await this.httpService.getTomorrowLoans(
      this.tomorrowLoansCurrentPage,
      this.itemsPerPage
    );
    this.tomorrowLoans = tomorrowLoansResult[0];
    this.tomorrowLoans.forEach((x) => {
      x.paidRepaymentCount = x.repayments.filter((x) => x.isPaid).length;
    });
    this.tomorrowLoansTotalItems = tomorrowLoansResult[1];
    this.todaychkBoxSelected = [];
    this.ytdchkBoxSelected = [];
    this.cd.detectChanges();
  }
  async ngOnInit(): Promise<void> {
    this.getRepayments();
  }

  payRepayment(repayment: Repayment, paidModal) {
    this.selectedRepayment = repayment;
    this.modalService.open(paidModal).result.then(
      (result) => {
        if (result == "Submit") {
          this.httpService.payRepayment(repayment);
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  selectedRepayment: Repayment;
  targetRepaymentDate;
  extendRepayment(repayment: Repayment, content) {
    this.selectedRepayment = repayment;
    this.targetRepaymentDate = new Date(
      repayment.targetRepaymentDate
    ).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.modalService.open(content).result.then(
      (result) => {
        if (result == "Submit") {
          repayment.targetRepaymentDate = new Date(this.targetRepaymentDate);
          this.httpService.extendRepayment(repayment);
        }
        console.log(repayment);
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    console.log(this.closeResult);
  }

  closeResult: string;
  open(content) {
    this.modalService.open(content).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    console.log(this.closeResult);
  }
  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  async blacklist(customer: Customer) {
    await this.httpService.blacklistCustomer(customer);
  }

  async repayCheckedLoans() {
    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });
    console.log("repaycheckedloans");
    console.log("todaychkBoxSelected", this.todaychkBoxSelected);
    console.log("ytdchkBoxSelected", this.ytdchkBoxSelected);
    await this.httpService.payAllRepaymentInList([
      ...this.todaychkBoxSelected,
      ...this.ytdchkBoxSelected,
    ]);
    await this.getRepayments();

    this.spinner.hide();
  }
  public ytdchkBoxSelected = [];
  public todaychkBoxSelected = [];
  public SelectionType;
  todaycustomChkboxOnSelect({ selected }: { selected: Repayment[] }) {
    this.todaychkBoxSelected.splice(0, this.todaychkBoxSelected.length);
    this.todaychkBoxSelected.push(...selected);
  }
  ytdcustomChkboxOnSelect({ selected }: { selected: Repayment[] }) {
    this.ytdchkBoxSelected.splice(0, this.ytdchkBoxSelected.length);
    this.ytdchkBoxSelected.push(...selected);
  }

  async setTodayRepaymentsPage(pageInfo) {
    this.todayLoansCurrentPage = pageInfo.offset;
    await this.getRepayments();
  }
  async setTomorrowRepaymentsPage(pageInfo) {
    this.tomorrowLoansCurrentPage = pageInfo.offset;
    await this.getRepayments();
  }
}
enum ModalDismissReasons {
  BACKDROP_CLICK = 0,
  ESC = 1,
}
