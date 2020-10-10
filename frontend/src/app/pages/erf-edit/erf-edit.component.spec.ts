import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErfEditComponent } from './erf-edit.component';

describe('ErfEditComponent', () => {
  let component: ErfEditComponent;
  let fixture: ComponentFixture<ErfEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErfEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErfEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
