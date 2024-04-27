import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTableComponent } from './loan-table.component';

describe('LoanTableComponent', () => {
  let component: LoanTableComponent;
  let fixture: ComponentFixture<LoanTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
