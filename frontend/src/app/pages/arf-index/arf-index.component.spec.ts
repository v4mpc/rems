import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArfIndexComponent } from './arf-index.component';

describe('ArfIndexComponent', () => {
  let component: ArfIndexComponent;
  let fixture: ComponentFixture<ArfIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArfIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArfIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
