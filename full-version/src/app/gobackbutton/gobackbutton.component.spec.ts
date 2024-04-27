import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GobackbuttonComponent } from './gobackbutton.component';

describe('GobackbuttonComponent', () => {
  let component: GobackbuttonComponent;
  let fixture: ComponentFixture<GobackbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GobackbuttonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GobackbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
