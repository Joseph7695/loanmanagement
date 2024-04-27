import {
  Component,
  Injectable,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Location } from "@angular/common";
@Component({
  selector: "app-gobackbutton",
  templateUrl: "./gobackbutton.component.html",
  styleUrls: ["./gobackbutton.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GobackbuttonComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}
  goBackFunction() {
    console.log("back");
    this._location.back();
  }
}
