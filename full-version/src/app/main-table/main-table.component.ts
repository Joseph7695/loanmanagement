import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import { MyPaginationComponent } from "app/my-pagination/my-pagination.component";
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from "rxjs";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-main-table",
  templateUrl: "./main-table.component.html",
  styleUrls: [
    "./main-table.component.scss",
    "../../assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MainTableComponent implements OnInit {
  comboParam = {
    itemsPerPage: 10,
    currentPage: 0,
    blacklistMode: 1,
    searchTerm: "",
  };
  public ColumnMode = ColumnMode;
  totalItems = 0;
  showSomething = "showAll";

  constructor(
    private cd: ChangeDetectorRef,
    public httpService: HttpService,
    private modalService: NgbModal,
    ) {}
  customers$!: Observable<Customer[]>;

  private searchTerms = new Subject<comboParam>();
  async ngOnInit(): Promise<void> {
    const result = await this.httpService.searchCustomer(
      "",
      this.comboParam.currentPage,
      this.comboParam.itemsPerPage,
      this.comboParam.blacklistMode
    );
    this.totalItems = result[1];

    this.customers$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap(async (param: comboParam) => {
        const result = await this.httpService.searchCustomer(
          param.searchTerm,
          param.currentPage,
          param.itemsPerPage,
          param.blacklistMode
        );
        this.totalItems = result[1];
        return result[0];
      }),
      startWith(result[0])
    );
    this.cd.detectChanges();
  }
  search(term: string): void {
    this.comboParam.searchTerm = term;
    this.searchTerms.next({ ...this.comboParam });
  }
  createNew(e: Event) {
    alert("create new");
  }

  async renewList(i) {
    this.comboParam.blacklistMode = i;
    this.searchTerms.next({ ...this.comboParam });
  }

  async changePage(page: number) {
    console.log("CHAINGING PAGE: " + page);
    this.comboParam.currentPage = page;
    this.searchTerms.next({ ...this.comboParam });
    console.log("total items in maintalbe", this.totalItems);
  }
  selectedCustomer;
  closeResult: string;
  async blacklist(customer: Customer, blackListModal) {
    this.selectedCustomer = customer;
    this.modalService.open(blackListModal).result.then(
      async (result) => {
        if (result == "Submit") {
          await this.httpService.blacklistCustomer(customer);
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

  async setPage(pageInfo) {
    this.comboParam.currentPage = pageInfo.offset;
    this.searchTerms.next({ ...this.comboParam });
  }
}
interface comboParam {
  searchTerm: string;
  blacklistMode: number;
  itemsPerPage: number;
  currentPage: number;
}

enum ModalDismissReasons {
  BACKDROP_CLICK = 0,
  ESC = 1,
}
