import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledStudentsMarks } from './enrolled-students-marks';

describe('EnrolledStudentsMarks', () => {
  let component: EnrolledStudentsMarks;
  let fixture: ComponentFixture<EnrolledStudentsMarks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrolledStudentsMarks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledStudentsMarks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
