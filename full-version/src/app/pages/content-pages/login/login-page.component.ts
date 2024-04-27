import { Component, ViewChild } from "@angular/core";
import {
  NgForm,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpService } from "../../../http.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  loginFormSubmitted = false;
  isLoginFailed = false;

  // loginForm = new UntypedFormGroup({
  //   username: new UntypedFormControl("SUPERADMIN", [Validators.required]),
  //   password: new UntypedFormControl("SUPERADMIN", [Validators.required]),
  //   rememberMe: new UntypedFormControl(true),
  // });
  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl("", [Validators.required]),
    password: new UntypedFormControl("", [Validators.required]),
    rememberMe: new UntypedFormControl(true),
  });

  constructor(
    private router: Router,
    private httpService: HttpService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    this.httpService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .then((res) => {
        this.spinner.hide();
        this.router.navigate(["/tables/home"]);
      })
      .catch((err) => {
        this.isLoginFailed = true;
        this.spinner.hide();
        alert("Failed to login");
        console.log("error: " + err);
      });
  }
}
