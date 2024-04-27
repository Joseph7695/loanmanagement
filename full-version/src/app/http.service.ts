import { Injectable } from "@angular/core";
import { Observable, catchError, firstValueFrom, of } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "./../environments/environment";
import Customer from "./models/customer";
import Loan from "./models/loan";
import Repayment from "./models/repayment";
import User from "./models/user";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  loanList: Loan[];
  async getCustomerDetail(id: number): Promise<Customer> {
    const result = await firstValueFrom(
      this.http
        .get<Customer>(`${this.apiEndpoint}/customers/detail?id=${id}`)
        .pipe(catchError(this.handleError<Customer>("getCustomerDetail")))
    );
    if (result instanceof HttpErrorResponse) {
      return null;
    }
    return result;
  }
  apiEndpoint = environment.apiEndpoint;
  // apiEndpoint = "https://redactedclientname.com.my/api";
  // apiEndpoint = "http://localhost:3000/api";
  get token() {
    return localStorage.getItem("accesstoken");
  }
  role = "";
  id = "";
  username = "";
  name = "";
  constructor(private http: HttpClient, private router: Router) {}
  async getRole() {
    this.role = JSON.parse(atob(this.token.split(".")[1])).role;
    this.username = JSON.parse(atob(this.token.split(".")[1])).username;
    this.name = JSON.parse(atob(this.token.split(".")[1])).name;
    this.id = JSON.parse(atob(this.token.split(".")[1])).sub;
  }
  async login(username: string, password: string) {
    const loginResult = await firstValueFrom(
      this.http
        .post<{ access_token: string }>(`${this.apiEndpoint}/auth/login`, {
          username,
          password,
        })
        // .post<{ access_token: string }>(`${this.apiEndpoint}/auth/login`, {
        //   username: "SUPERADMIN",
        //   password: "SUPERADMIN",
        // })
        .pipe(catchError(this.handleError<{ access_token: string }>("login")))
    );
    if (loginResult instanceof HttpErrorResponse) {
      return loginResult;
    }

    if (loginResult.access_token) {
      localStorage.setItem("accesstoken", loginResult.access_token);
    }
    this.getRole();
    return loginResult;
  }
  async searchLoans(
    searchTerm: string,
    pageNumber: number,
    itemsPerPage: number
  ) {
    return await firstValueFrom(
      this.http
        .get<[Loan[], number]>(
          `${this.apiEndpoint}/loans/search?searchTerm=${searchTerm}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(catchError(this.handleError<[Loan[], number]>("getAllCustomers")))
    );
  }

  async searchCustomer(
    searchTerm: string,
    pageNumber: number,
    itemsPerPage: number,
    blackListMode: number
  ) {
    return await firstValueFrom(
      this.http
        .get<[Customer[], number]>(
          `${this.apiEndpoint}/customers/searchCustomer?searchTerm=${searchTerm}&blackListMode=${blackListMode}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(
          catchError(this.handleError<[Customer[], number]>("getAllCustomers"))
        )
    );
  }

  async searchUser(
    searchTerm: string,
    isStillWorking: boolean | null,
    pageNumber: number,
    itemsPerPage: number
  ) {
    return await firstValueFrom(
      this.http
        .get<[User[], number]>(
          `${this.apiEndpoint}/users/searchUser?searchTerm=${searchTerm}&isStillWorking=${isStillWorking}&pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(catchError(this.handleError<[User[], number]>("searchUser")))
    );
  }

  async getAllCustomers(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Customer[], number]>(
          `${this.apiEndpoint}/customers?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(
          catchError(this.handleError<[Customer[], number]>("getAllCustomers"))
        )
    );
  }
  async getAllBlacklistCustomers(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Customer[], number]>(
          `${this.apiEndpoint}/customers/blacklist?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(
          catchError(
            this.handleError<[Customer[], number]>("getAllBlacklistCustomers")
          )
        )
    );
  }
  async getAllNoBlacklistCustomers(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Customer[], number]>(
          `${this.apiEndpoint}/customers/noblacklist?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(
          catchError(
            this.handleError<[Customer[], number]>("getAllBlacklistCustomers")
          )
        )
    );
  }
  async addCustomer(customer: Customer) {
    return await firstValueFrom(
      this.http
        .post<Customer[]>(`${this.apiEndpoint}/customers/add`, customer)
        .pipe(catchError(this.handleError<Customer[]>("addCustomer")))
    );
  }
  async blacklistCustomer(customer: Customer) {
    customer.isBlacklist = !customer.isBlacklist;
    await this.updateCustomer(customer);
  }

  async changeIsStillWorkingUser(user: User) {
    user.isStillWorking = !user.isStillWorking;
    await this.editUser(user);
  }

  async updateCustomer(customer: Customer) {
    return await firstValueFrom(
      this.http
        .post<Customer>(`${this.apiEndpoint}/customers/update`, customer)
        .pipe(catchError(this.handleError<Customer>("updateCustomer")))
    );
  }
  async deleteCustomer(customer: Customer) {
    return await firstValueFrom(
      this.http
        .post<Customer>(`${this.apiEndpoint}/customers/delete`, customer)
        .pipe(catchError(this.handleError<Customer>("deleteCustomer")))
    );
  }
  async getTodayLoans(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Loan[], number]>(
          `${this.apiEndpoint}/loans/todaylist?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(catchError(this.handleError<[Loan[], number]>("getTodayLoans")))
    );
  }
  async getTomorrowLoans(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Loan[], number]>(
          `${this.apiEndpoint}/loans/tomorrowlist?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(
          catchError(this.handleError<[Loan[], number]>("getTomorrowLoans"))
        )
    );
  }
  async getAllLoans(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[Loan[], number]>(
          `${this.apiEndpoint}/loans?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(catchError(this.handleError<[Loan[], number]>("getAllLoans")))
    );
  }
  async getSpecificUserLoans(userId: number) {
    return await firstValueFrom(
      this.http
        .get<[Loan[], number]>(
          `${this.apiEndpoint}/loans/ofuser?customerid=${userId}`
        )
        .pipe(
          catchError(this.handleError<[Loan[], number]>("getSpecificUserLoans"))
        )
    );
  }

  async getLoanDetail(id: number) {
    const result = await firstValueFrom(
      this.http
        .get<Loan>(`${this.apiEndpoint}/loans/detail?id=${id}`)
        .pipe(catchError(this.handleError<Loan>("getLoanDetail")))
    );
    if (result instanceof HttpErrorResponse) {
      return null;
    }
    return result;
  }
  async payPrincipal(loan: Loan, repaymentAmount: number) {
    return await firstValueFrom(
      this.http
        .post<Repayment>(
          `${this.apiEndpoint}/loans/payPrincipal?repaymentAmount=${repaymentAmount}`,
          loan
        )
        .pipe(catchError(this.handleError<Repayment>("payPrincipal")))
    );
  }
  async addLoan(loan: Loan) {
    return await firstValueFrom(
      this.http
        .post<Loan>(`${this.apiEndpoint}/loans/add`, loan)
        .pipe(catchError(this.handleError<Loan>("addLoan")))
    );
  }
  async finishUnlimitedLoan(loan: Loan) {
    return await firstValueFrom(
      this.http
        .post<Loan>(`${this.apiEndpoint}/loans/finish`, loan)
        .pipe(catchError(this.handleError<Loan>("finishUnlimitedLoan")))
    );
  }
  async updateLoan(loan: Loan) {
    return await firstValueFrom(
      this.http
        .post<Loan>(`${this.apiEndpoint}/loans/update`, loan)
        .pipe(catchError(this.handleError<Loan>("updateLoan")))
    );
  }
  async deleteLoan(loan: Loan) {
    return await firstValueFrom(
      this.http
        .post<Loan>(`${this.apiEndpoint}/loans/delete`, loan)
        .pipe(catchError(this.handleError<Loan>("deleteLoan")))
    );
  }
  async payRepayment(repayment: Repayment) {
    repayment.isPaid = true;
    repayment.receivedAmount = repayment.repaymentAmount;
    return await firstValueFrom(
      this.http
        .post<Repayment>(`${this.apiEndpoint}/repayment/payment`, repayment)
        .pipe(catchError(this.handleError<Repayment>("payRepayment")))
    );
  }
  async payAllRepaymentInList(repayments: Repayment[]) {
    repayments = repayments.filter((x) => x); // remove null values
    repayments.forEach((repayment) => {
      repayment.isPaid = true;
      repayment.receivedAmount = repayment.repaymentAmount;
    });

    return await firstValueFrom(
      this.http
        .post<Repayment[]>(
          `${this.apiEndpoint}/repayment/paymentsInList`,
          repayments
        )
        .pipe(
          catchError(this.handleError<Repayment[]>("payAllRepaymentInList"))
        )
    );
  }
  async extendRepayment(repayment: Repayment) {
    return await firstValueFrom(
      this.http
        .post<Repayment>(`${this.apiEndpoint}/repayment/extend`, repayment)
        .pipe(catchError(this.handleError<Repayment>("extendRepayment")))
    );
  }

  async getAllUsers(pageNumber: number, itemsPerPage: number) {
    return await firstValueFrom(
      this.http
        .get<[User[], number]>(
          `${this.apiEndpoint}/users?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}`
        )
        .pipe(catchError(this.handleError<[User[], number]>("getAllUsers")))
    );
  }
  async getUser(id: number) {
    const result = await firstValueFrom(
      this.http
        .get<User>(`${this.apiEndpoint}/users/detail?id=${id}`)
        .pipe(catchError(this.handleError<User>("createUser")))
    );
    if (result instanceof HttpErrorResponse) {
      return null;
    }
    return result;
  }
  async createUser(user: User) {
    return await firstValueFrom(
      this.http
        .post<User>(`${this.apiEndpoint}/users/add`, user)
        .pipe(catchError(this.handleError<User>("createUser")))
    );
  }
  async editUser(user: User) {
    return await firstValueFrom(
      this.http
        .post<User>(`${this.apiEndpoint}/users/edit`, user)
        .pipe(catchError(this.handleError<User>("editUser")))
    );
  }
  async deleteUser(userid: number) {
    return await firstValueFrom(
      this.http
        .post<User>(`${this.apiEndpoint}/users/delete?userId=${userid}`, {})
        .pipe(catchError(this.handleError<User>("deleteUser")))
    );
  }
  async uploadFile(
    files: { file: File; fileType: string }[]
  ): Promise<{ fileType: string; filePath: string }[]> {
    console.log("Uploading ", files);
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      formData.append(file.fileType, file.file);
    }
    return await firstValueFrom(
      this.http.post<{ fileType: string; filePath: string }[]>(
        `${this.apiEndpoint}/loans/upload`,
        formData
      )
    );
  }
  getFile(filename: string) {
    if (!filename) {
      return "";
    }
    return `${this.apiEndpoint}/loans/file?filename=${filename}`;
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: HttpErrorResponse): Observable<HttpErrorResponse> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      console.log("faileddd", { error });
      if (error.status == 401 && operation != "login") {
        localStorage.setItem("accesstoken", "");
        this.router.navigate(["pageNumbers/login"]);
      }
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error);
    };
  }
}
