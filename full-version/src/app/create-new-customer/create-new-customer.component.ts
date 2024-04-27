import { Component, OnInit } from "@angular/core";
import Customer from "../models/customer";
import { HttpService } from "../http.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import {
  Subject,
  concat,
  of,
  distinctUntilChanged,
  tap,
  switchMap,
  Observable,
} from "rxjs";
import User from "app/models/user";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-create-new-customer",
  templateUrl: "./create-new-customer.component.html",
  styleUrls: ["./create-new-customer.component.scss"],
})
export class CreateNewCustomerComponent implements OnInit {
  createCustomerFormSubmitted = false;

  createCustomerForm = new UntypedFormGroup({
    name: new UntypedFormControl([Validators.required]),
    ic: new UntypedFormControl([Validators.required]),
    icImagePath: new UntypedFormControl([Validators.required]),
    homeAddressGoogleMapsUrl: new UntypedFormControl([Validators.required]),
    phoneNumber: new UntypedFormControl([Validators.required]),
    occupation: new UntypedFormControl([Validators.required]),
    companyName: new UntypedFormControl([Validators.required]),
    salary: new UntypedFormControl([Validators.required]),
    carPlateNumber: new UntypedFormControl([Validators.required]),
    user: new UntypedFormControl([Validators.required]),
    officeLocationGoogleMapsUrl: new UntypedFormControl([]),
    emergencyContactName: new UntypedFormControl([]),
    emergencyContactNumber: new UntypedFormControl([]),
    emergencyContactName2: new UntypedFormControl([]),
    emergencyContactNumber2: new UntypedFormControl([]),
    emergencyContactName3: new UntypedFormControl([]),
    emergencyContactNumber3: new UntypedFormControl([]),
    emergencyContactName4: new UntypedFormControl([]),
    emergencyContactNumber4: new UntypedFormControl([]),
    emergencyContactName5: new UntypedFormControl([]),
    emergencyContactNumber5: new UntypedFormControl([]),
  });

  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  trackByFn(item: User) {
    return item.id;
  }
  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router
  ) {}

  users$: Observable<User[]>;

  ngOnInit(): void {
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
  }
  powers = ["Really Smart", "Super Flexible", "Super Hot", "Weather Changer"];

  model: Customer = {} as Customer;
  attachedfiles: { file: File; fileType: string }[] = [];
  submitted = false;

  get lf() {
    return this.createCustomerForm.controls;
  }

  async onSubmit() {
    this.createCustomerFormSubmitted = true;
    if (this.createCustomerForm.invalid) {
      return;
    }

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

    const result = await this.httpService.addCustomer(this.model);
    console.log("submit result: ", result);
    this.submitted = true;
    this.spinner.hide();
    alert("Created successfully");
    // this.back()
  }

  icImage = "icImagePath";
  homeAddressImagePath = "homeAddressImagePath";
  officeLocationImagePath = "officeLocationImagePath";
  waterUtilityBillImagePath = "waterUtilityBillImagePath";
  electricUtilityBillImagePath = "electricUtilityBillImagePath";
  salarySlipImagePath = "salarySlipImagePath";

  back() {
    this.router.navigate(["/tables/mainTable"]);
  }

  onChange(files: any, filetype: string) {
    const existing = this.attachedfiles.find((x) => x.fileType == filetype);
    console.log(existing, filetype, files.files);
    if (existing) {
      existing.file = files.files[0];
      console.log(this.attachedfiles);
      this.createCustomerForm.controls[filetype].setValue(files.files[0].name); // <-- Set Value for Validation
    } else {
      this.attachedfiles.push({ file: files.files[0], fileType: filetype });
      console.log(this.attachedfiles);
      this.createCustomerForm.controls[filetype].setValue(files.files[0].name); // <-- Set Value for Validation
    }
  }
}
