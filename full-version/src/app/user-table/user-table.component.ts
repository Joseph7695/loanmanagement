import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { HttpService } from "app/http.service";
import User from "app/models/user";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-user-table",
  templateUrl: "./user-table.component.html",
  styleUrls: [
    "./user-table.component.scss",
    "../../assets/sass/libs/datatables.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserTableComponent implements OnInit {
  itemsPerPage = 20;
  currentPage = 0;
  totalItems = 0;
  public ColumnMode = ColumnMode;
  constructor(
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    public httpService: HttpService
  ) {}
  users: User[] = [];
  async getUsers() {
    const userResult = await this.httpService.getAllUsers(
      this.currentPage,
      this.itemsPerPage
    );
    this.users = userResult[0];
    this.totalItems = userResult[1];
    this.cd.detectChanges();
  }
  async ngOnInit(): Promise<void> {
    this.getUsers();
  }

  async changePage(page: number) {
    this.currentPage = page;
    await this.httpService.getAllUsers(this.currentPage, this.itemsPerPage);
  }

  selectedUser;
  closeResult: string;
  async deleteUser(user: User, deleteModal) {
    this.selectedUser = user;
    this.modalService.open(deleteModal).result.then(
      async (result) => {
        if (result == "Submit") {
          await this.httpService.deleteUser(user.id);
          await this.getUsers();
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

  async changeIsStillWorking(user: User , changeIsStillWorkingModal ) {
    this.selectedUser = user;
    this.modalService.open(changeIsStillWorkingModal).result.then(
      async (result) => {
        if (result == "Submit") {
          await this.httpService.changeIsStillWorkingUser(user);
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    console.log(this.closeResult);



  }

  async setPage(pageInfo) {
    this.currentPage = pageInfo.offset;
    await this.getUsers();
  }
}
enum ModalDismissReasons {
  BACKDROP_CLICK = 0,
  ESC = 1,
}
