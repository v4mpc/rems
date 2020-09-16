import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArfCreateComponent } from './arf-create.component';

describe('ArfCreateComponent', () => {
  let component: ArfCreateComponent;
  let fixture: ComponentFixture<ArfCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArfCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArfCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
