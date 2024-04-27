import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "../http.service";
import Customer from "../models/customer";
import User from "../models/user";
import { NgxSpinnerService } from "ngx-spinner";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
})
export class EditUserComponent implements OnInit {
  editUserFormSubmitted = false;

  editUserForm = new UntypedFormGroup({
    username: new UntypedFormControl([Validators.required]),
    password: new UntypedFormControl([]),
    name: new UntypedFormControl([Validators.required]),
    role: new UntypedFormControl([Validators.required]),
  });

  constructor(
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private httpService: HttpService,
    private router: Router
  ) {}

  back() {
    this.router.navigate(["/tables/userTable"]);
  }
  user: User;
  async ngOnInit(): Promise<void> {
    this.getHero();
  }
  async getHero(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.user = await this.httpService.getUser(id);
    this.cd.detectChanges();
  }

  get lf() {
    return this.editUserForm.controls;
  }

  async onSubmit() {
    this.editUserFormSubmitted = true;
    if (this.editUserForm.invalid) {
      return;
    }

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    await this.httpService.editUser(this.user);
    this.spinner.hide();
    alert("Updated successfully");
    this.back();
  }
}
