import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import Loan from "app/models/loan";
import { ColumnMode } from "@swimlane/ngx-datatable";
import Repayment from "../models/repayment";
import { NgxSpinnerService } from "ngx-spinner";
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from "rxjs";

@Component({
  selector: "app-loan-table",
  templateUrl: "./loan-table.component.html",
  styleUrls: ["./loan-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoanTableComponent implements OnInit {
  comboParam = {
    itemsPerPage: 10,
    currentPage: 0,
    searchTerm: "",
  };
  private searchTerms = new Subject<comboParam>();

  public chkBoxSelected = [];
  public SelectionType;
  customChkboxOnSelect({ selected }: { selected: Loan[] }) {
    const repayments = selected.map((x) => x.repayments[0]);
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...repayments);
  }
  totalItems = 0;
  public ColumnMode = ColumnMode;
  constructor(
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    public httpService: HttpService
  ) {}
  loans$!: Observable<Loan[]>;
  async ngOnInit(): Promise<void> {
    const result = await this.httpService.searchLoans(
      "",
      this.comboParam.currentPage,
      this.comboParam.itemsPerPage
    );
    this.totalItems = result ? result[1] : 0;

    this.loans$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap(async (param: comboParam) => {
        const result = await this.httpService.searchLoans(
          param.searchTerm,
          param.currentPage,
          param.itemsPerPage
        );
        try {
          this.totalItems = result[1];
          return result[0];
        } catch (error) {
          console.log(error);
          this.totalItems = 0;
          return [];
        }
      }),
      startWith(result ? result[0] : [])
    );
    this.cd.detectChanges();
  }

  createNew(e: Event) {
    alert("create new");
  }

  renewList(i) {
    alert(i);
  }

  async setPage(pageInfo) {
    this.comboParam.currentPage = pageInfo.offset;
    this.searchTerms.next({ ...this.comboParam });
  }

  // async changePage(page: number) {
  //   this.currentPage = page;
  //   const result = await this.httpService.getAllLoans(
  //     this.currentPage,
  //     this.itemsPerpage
  //   );
  //   this.loans = result[0];
  //   this.totalItems = result[1];
  //   this.chkBoxSelected = [];
  //   console.log(this.totalItems, this.currentPage, this.itemsPerpage);
  //   this.cd.detectChanges();
  // }
  selectedLoan;
  closeResult: string;
  async deleteLoan(loan: Loan, deleteModal) {
    this.selectedLoan = loan;
    this.modalService.open(deleteModal).result.then(
      async (result) => {
        if (result == "Submit") {
          await this.httpService.deleteLoan(loan);
          this.searchTerms.next({ ...this.comboParam });
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    console.log(this.closeResult);
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  targetRepaymentDate;
  extendRepayment(loan: Loan, content) {
    this.selectedLoan = loan;
    this.targetRepaymentDate = new Date(
      loan.repayments[0].targetRepaymentDate
    ).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.modalService.open(content).result.then(
      async (result) => {
        if (result == "Submit") {
          loan.repayments[0].targetRepaymentDate = new Date(
            this.targetRepaymentDate
          );
          await this.httpService.extendRepayment(loan.repayments[0]);
          this.searchTerms.next({ ...this.comboParam });
        }
        console.log(loan);
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    console.log(this.closeResult);
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
    console.log(this.chkBoxSelected);
    await this.httpService.payAllRepaymentInList(this.chkBoxSelected);
    this.searchTerms.next({ ...this.comboParam });
    this.spinner.hide();
  }

  search(term: string): void {
    console.log(term);
    this.comboParam.searchTerm = term;
    this.searchTerms.next({ ...this.comboParam });
  }
}
enum ModalDismissReasons {
  BACKDROP_CLICK = 0,
  ESC = 1,
}
interface comboParam {
  searchTerm: string;
  itemsPerPage: number;
  currentPage: number;
}
