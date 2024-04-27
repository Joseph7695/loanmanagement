import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Customer from "../models/customer";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpService } from "../http.service";
import Loan from "../models/loan";
import User from "../models/user";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-create-new-user",
  templateUrl: "./create-new-user.component.html",
  styleUrls: ["./create-new-user.component.scss"],
})
export class CreateNewUserComponent implements OnInit {

  createUserFormSubmitted = false;

  createUserForm = new UntypedFormGroup({
    username: new UntypedFormControl( [Validators.required]),
    password: new UntypedFormControl([Validators.required]),
    name: new UntypedFormControl([Validators.required]),
    role: new UntypedFormControl([Validators.required]),
  });

  constructor(
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router
  ) {}

  customer: Customer;
  back() {
    this.router.navigate(["/tables/userTable"]);
  }
  model = {} as User;
  async ngOnInit(): Promise<void> {}
  
  get lf() {
    return this.createUserForm.controls;
  }


  async onSubmit() {

    this.createUserFormSubmitted = true;
    if (this.createUserForm.invalid) {
      return;
    }

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    await this.httpService.createUser(this.model);
    this.spinner.hide();
    alert("Created successfully");
    this.back();
  }
}
