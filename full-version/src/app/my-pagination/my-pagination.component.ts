import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'app/http.service';
import Customer from 'app/models/customer';

@Component({
  selector: 'app-my-pagination',
  templateUrl: './my-pagination.component.html',
  styleUrls: ['./my-pagination.component.scss']
})
export class MyPaginationComponent implements OnInit {
  @Input() set totalItems(value: number) {
    this._totalItems = value;
    console.log("total items changed: ", this._totalItems)
    if (this._totalItems) {
      this.totalPages = Math.ceil(this._totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
     
    }
  }
  private _totalItems: number;
  @Input() currentPage: any
  @Input() itemsPerPage: any
  @Output() onClick: EventEmitter<number> = new EventEmitter()

  totalPages = 0
  pages: number[] = []

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    console.log("values in mypaginationcomponent", this.totalItems, this.currentPage, this.itemsPerPage)
    if (this.totalItems) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
  }
  // totalItems() :number{
  //   return this.customers.length;
  // }

  pageClicked(page: number) {
    if (page > this.totalPages) return;
    if (page < 1) return;
    this.onClick.emit(page)
  }
}
