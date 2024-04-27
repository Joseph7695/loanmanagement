import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaginationComponent } from './my-pagination.component';

describe('MyPaginationComponent', () => {
  let component: MyPaginationComponent;
  let fixture: ComponentFixture<MyPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
