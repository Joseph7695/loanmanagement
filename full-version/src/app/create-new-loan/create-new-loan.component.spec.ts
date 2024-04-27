import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewLoanComponent } from './create-new-loan.component';

describe('CreateNewLoanComponent', () => {
  let component: CreateNewLoanComponent;
  let fixture: ComponentFixture<CreateNewLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewLoanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
