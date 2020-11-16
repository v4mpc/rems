import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArfComponent } from './arf.component';

describe('ArfComponent', () => {
  let component: ArfComponent;
  let fixture: ComponentFixture<ArfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
