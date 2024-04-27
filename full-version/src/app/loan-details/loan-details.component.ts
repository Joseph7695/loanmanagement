import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/http.service";
import Loan from "app/models/loan";
import { ColumnMode } from "@swimlane/ngx-datatable";
import {} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import Repayment from "../models/repayment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Customer from "../models/customer";

@Component({
  selector: "app-loan-details",
  templateUrl: "./loan-details.component.html",
  styleUrls: ["./loan-details.component.scss"],
})
export class LoanDetailsComponent implements OnInit {
  public ColumnMode = ColumnMode;
  constructor(
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public httpService: HttpService
  ) {}
  loaded = false;
  loan: Loan = {} as Loan;
  repayments;
  receivedAmountSum;
  expectedAmountSum;
  totalPaidPrincipal;
  async ngOnInit(): Promise<void> {
    this.getHero();
  }
  async getHero(): Promise<void> {
    this.chkBoxSelected = [];
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.loan = await this.httpService.getLoanDetail(id);
    this.repayments = this.loan.repayments;
    this.receivedAmountSum = this.loan.repayments.reduce(
      (prev, current, index, array) => {
        return prev + current.receivedAmount;
      },
      0
    );
    this.expectedAmountSum = this.loan.repayments.reduce(
      (prev, current, index, array) => {
        if (current.isPaid) {
          return prev + current.receivedAmount;
        }
        return prev + current.repaymentAmount;
      },
      0
    );
    this.totalPaidPrincipal = this.loan.repayments.reduce(
      (prev, current, index, array) => {
        if (current.isPrincipalRepayment) {
          return prev + current.receivedAmount;
        }
        return prev;
      },
      0
    );
    console.log(this.loan);
    this.loaded = true;
    this.cd.detectChanges();
  }

  public chkBoxSelected = [];
  // public SelectionType;
  customChkboxOnSelect({ selected }: { selected: Repayment[] }) {
    const repayments = selected.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...repayments);
    console.log(this.chkBoxSelected);
  }

  payRepayment(repayment: Repayment, paidModal) {
    this.selectedRepayment = repayment;
    this.modalService.open(paidModal).result.then(
      async (result) => {
        if (result == "Submit") {
          await this.httpService.payRepayment(repayment);
          await this.getHero();
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
  extendRepayment(repayment: Repayment, extendModal) {
    console.log(repayment);
    this.selectedRepayment = repayment;
    this.targetRepaymentDate = new Date(
      repayment.targetRepaymentDate
    ).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.modalService.open(extendModal).result.then(
      async (result) => {
        if (result == "Submit") {
          repayment.targetRepaymentDate = new Date(this.targetRepaymentDate);
          await this.httpService.extendRepayment(repayment);
          await this.getHero();
        }
        console.log(repayment);
        this.closeResult = `Closed with: ${result}`;
        console.log(this.closeResult);
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        console.log(this.closeResult);
      }
    );
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
    console.log("chkBoxSelected", this.chkBoxSelected);
    await this.httpService.payAllRepaymentInList([...this.chkBoxSelected]);
    this.getHero();
    this.spinner.hide();
  }

  async finishUnlimitedLoan() {
    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });
    await this.httpService.finishUnlimitedLoan(this.loan);

    this.getHero();
    this.spinner.hide();
  }
  repaymentAmount;
  async payPrincipal(payPrincipalModal) {
    this.modalService.open(payPrincipalModal).result.then(
      async (result) => {
        if (result == "Submit") {
          this.spinner.show(undefined, {
            type: "ball-triangle-path",
            size: "medium",
            bdColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            fullScreen: true,
          });
          await this.httpService.payPrincipal(this.loan, this.repaymentAmount);

          this.getHero();
          this.spinner.hide();
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
enum ModalDismissReasons {
  BACKDROP_CLICK = 0,
  ESC = 1,
}
