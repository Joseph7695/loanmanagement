import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import Loan from "../models/loan";
import { NgxSpinnerService } from "ngx-spinner";

import {
  FormGroup,
  FormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgSelectModule, NgOption } from "@ng-select/ng-select";
import {
  concat,
  of,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  Observable,
  Subject,
  Subscription,
} from "rxjs";
import { startsWith } from "core-js/core/string";
import { map } from "core-js/core/array";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import User from "app/models/user";

@Component({
  selector: "app-create-new-loan",
  templateUrl: "./create-new-loan.component.html",
  styleUrls: ["./create-new-loan.component.scss"],
})
export class CreateNewLoanComponent implements OnInit {
  createLoanFormSubmitted = false;

  createLoanForm = new UntypedFormGroup({
    name: new UntypedFormControl([Validators.required]),
    loanedAmount: new UntypedFormControl([Validators.required]),
    loanApplicationDate: new UntypedFormControl([Validators.required]),
    loanRepaymentFrequency: new UntypedFormControl([Validators.required]),
    loanSingleRepaymentAmount: new UntypedFormControl([Validators.required]),
    user: new UntypedFormControl([Validators.required]),
    customer: new UntypedFormControl([Validators.required]),

    loanRepaymentTotalCount: new UntypedFormControl(),
    loanTotalPrincipal: new UntypedFormControl(),

    // more dynamic way TODO: https://stackoverflow.com/a/61567922/12295149
    // loanRepaymentTotalCount: this.conditionallyRequiredValidator(
    //   "age",
    //   ">=",
    //   18,
    //   "licenceNo"
    // ),
  });

  isUnlimitedView = false;
  trackByFn(item: Customer) {
    return item.id;
  }

  trackByFnUser(item: User) {
    return item.id;
  }
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  constructor(
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private router: Router
  ) {}

  customers$: Observable<Customer[]>;
  users$: Observable<User[]>;
  selectedDate: string;
  model = { loanApplicationDate: new Date() } as Loan;
  userSubscription: Subscription;
  async ngOnInit(): Promise<void> {
    this.userSubscription = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        //------ some code -----
        this.isUnlimitedView = JSON.parse(queryParams["isUnlimited"]);
        // this.createLoanForm.get("age").valueChanges.subscribe((val) => {
        if (this.isUnlimitedView) {
          this.createLoanForm.controls[
            "loanRepaymentTotalCount"
          ].clearValidators();
          this.createLoanForm.controls["loanTotalPrincipal"].setValidators([
            Validators.required,
          ]);
        } else {
          this.createLoanForm.controls["loanTotalPrincipal"].clearValidators();

          this.createLoanForm.controls["loanRepaymentTotalCount"].setValidators(
            [Validators.required]
          );
        }
        this.createLoanForm.controls[
          "loanRepaymentTotalCount"
        ].updateValueAndValidity();
        this.createLoanForm.controls[
          "loanTotalPrincipal"
        ].updateValueAndValidity();
        // });
      }
    );

    // const result = await this.httpService.getAllCustomers(1, 100);
    this.customers$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.peopleLoading = true)),
        switchMap(async (term) => {
          try {
            const result = await this.httpService.searchCustomer(
              term,
              0,
              20,
              1
            );
            return result[0];
          } catch (error) {
            return [];
          } finally {
            this.peopleLoading = false;
          }
        })
      )
    );

    this.users$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.peopleLoading = true)),
        switchMap(async (term) => {
          try {
            const result = await this.httpService.searchUser(term, true, 0, 20);
            return result[0];
          } catch (error) {
            return [];
          } finally {
            this.peopleLoading = false;
          }
        })
      )
    );

    const now = new Date().toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.selectedDate = now;
    this.cd.detectChanges();
  }

  get lf() {
    return this.createLoanForm.controls;
  }

  async onSubmit() {
    this.createLoanFormSubmitted = true;
    if (this.createLoanForm.invalid) {
      return;
    }

    console.log(new Date(this.selectedDate));
    this.model.loanApplicationDate = new Date(this.selectedDate);
    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });
    var uploadedFiles = await this.httpService.uploadFile(this.attachedfiles);
    uploadedFiles.forEach((result) => {
      this.model[result.fileType] = result.filePath;
    });

    this.model.isUnlimited = this.isUnlimitedView;
    await this.httpService.addLoan(this.model);
    this.spinner.hide();
    alert("Created successfully");
    this.back();
  }

  attachedfiles: { file: File; fileType: string }[] = [];
  hardcopyImagePath = "hardcopyImagePath";
  hardcopyImagePath2 = "hardcopyImagePath2";
  hardcopyImagePath3 = "hardcopyImagePath3";
  hardcopyImagePath4 = "hardcopyImagePath4";
  hardcopyImagePath5 = "hardcopyImagePath5";
  hardcopyImagePath6 = "hardcopyImagePath6";

  back() {
    this.router.navigate(["/tables/loanTable"]);
  }

  onChange(files: FileList, filetype: string) {
    const existing = this.attachedfiles.find((x) => x.fileType == filetype);
    if (existing) {
      existing.file = files[0];
    } else {
      this.attachedfiles.push({ file: files[0], fileType: filetype });
    }
  }

  customerSelected(event) {
    console.log(this.model.customer);
    if (this.model.customer.user.isStillWorking) {
      this.model.user = this.model.customer.user;
    } else {
      alert("Agent is not working already, please choose a new agent");
    }
  }
  // https://stackoverflow.com/a/61567922/12295149
  // conditionallyRequiredValidator(
  //   masterControlLabel: string,
  //   operator: string,
  //   conditionalValue: any,
  //   slaveControlLabel: string
  // ) {
  //   return (group: FormGroup): { [key: string]: any } => {
  //     const masterControl = group.controls[masterControlLabel];
  //     const slaveControl = group.controls[slaveControlLabel];
  //     if (
  //       Function(
  //         `"use strict"; return '${masterControl.value}' ${operator} '${conditionalValue}'`
  //       )()
  //     ) {
  //       return Validators.required(slaveControl);
  //     }
  //     slaveControl.setErrors(null);
  //     return null;
  //   };
  // }
}
