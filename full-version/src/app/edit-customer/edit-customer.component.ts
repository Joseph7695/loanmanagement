import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpService } from "app/http.service";
import Customer from "app/models/customer";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Location } from "@angular/common";
import { concat, of, distinctUntilChanged, tap, switchMap } from "rxjs";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import User from "app/models/user";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-edit-customer",
  templateUrl: "./edit-customer.component.html",
  styleUrls: ["./edit-customer.component.scss"],
})
export class EditCustomerComponent implements OnInit {
  editCustomerFormSubmitted = false;

  editCustomerForm = new UntypedFormGroup({
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
    private _location: Location,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public httpService: HttpService,
    private router: Router
  ) {}
  users$: Observable<User[]>;
  customer = {} as Customer;

  async ngOnInit(): Promise<void> {
    this.getHero();

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

  async getHero(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.customer = await this.httpService.getCustomerDetail(id);
    console.log(this.customer);
    this.cd.detectChanges();
  }

  back(id: number) {
    this.router.navigate(["/tables/customerDetails/" + id]);
  }

  get lf() {
    return this.editCustomerForm.controls;
  }

  async onSubmit() {
    this.editCustomerFormSubmitted = true;
    if (this.editCustomerForm.invalid) {
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
      this.customer[result.fileType] = result.filePath;
    });


    await this.httpService.updateCustomer(this.customer);
    this.spinner.hide();
    alert("Updated successfully");
    this._location.back();
  }

  icImage = "icImagePath";
  homeAddressImage = "homeAddressImagePath";
  officeLocationImage = "officeLocationImagePath";
  waterUtilityBillImage = "waterUtilityBillImagePath";
  electricUtilityBillImage = "electricUtilityBillImagePath";
  salarySlipImage = "salarySlipImagePath";
  icImagePath = "";
  homeAddressImagePath = "";
  officeLocationImagePath = "";
  waterUtilityBillImagePath = "";
  electricUtilityBillImagePath = "";
  salarySlipImagePath = "";
  attachedfiles: { file: File; fileType: string }[] = [];
  onChange(files: any, filetype: string) {
    const existing = this.attachedfiles.find((x) => x.fileType == filetype);
    this[filetype] = files.files[0].name;
    console.log(existing, filetype, files.files);
    if (existing) {
      existing.file = files.files[0];
      console.log(this.attachedfiles);
      this.editCustomerForm.controls[filetype]?.setValue(files.files[0].name); // <-- Set Value for Validation
    } else {
      this.attachedfiles.push({ file: files.files[0], fileType: filetype });
      console.log(this.attachedfiles);
      this.editCustomerForm.controls[filetype]?.setValue(files.files[0].name); // <-- Set Value for Validation
    }
  }
}
