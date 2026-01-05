import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
declare var bootstrap: any;

@Component({
  selector: 'app-student-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-enrollment.html',
  styleUrl: './student-enrollment.css',
})
export class StudentEnrollment implements OnInit {
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('alreadyEnrolledModal') alreadyEnrolledModal!: ElementRef;
  @ViewChild('noRecordsModal') noRecordsModal!: ElementRef;

  departments: any[] = [];
  courses: any[] = [];
  selectedDept1: any = null;
  selectedDept2: any = null;
  selectedCourse: any = null;
  DEPARTMENT_ID: number = 0;
  COURSE_ID: number = 0;
  students: any[] = [];
  selectedStudentsIds: number[] = [];
  selectedCourseId: any[] = [];
  isGetDetails: boolean = false;
  isEnrollStudent: boolean = false;
  isReset: boolean = false;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getDepartments().subscribe((data: any) => {
      this.departments = data;
      console.log('departments loaded:', this.departments);
    });
  }

  onDepartmentChange() {
    if (this.selectedDept1) {
      console.log('selectd department is:', this.selectedDept1);
      this.studentService
        .getCourses(this.selectedDept1?.DEPARTMENT_ID)
        .subscribe((data: any) => {
          this.courses = data;
          console.log('courses loaded', this.courses);
        });
    } else {
      this.selectedCourse = null;
    }
  }

  onCourseChange() {
    if (!this.selectedCourse) {
      console.log('course is mandatory');
    } else {
      console.log(
        'selected course course id is->',
        this.selectedCourse?.COURSE_ID
      );
    }
  }

  onSubmit() {
    this.isGetDetails = true;
    if (!this.selectedCourse || !this.selectedDept1 || !this.selectedDept2) {
      alert('All fields are mandatory');
      return;
    } else {
      this.studentService
        .getStudentsOfDept(
          this.selectedDept2?.DEPARTMENT_ID,
          this.selectedCourse?.COURSE_ID
        )
        ?.subscribe((data: any) => {
          console.log(
            'selected department id of department 2 dropdown is->',
            this.selectedDept2.DEPARTMENT_ID
          );
          console.log('students of selected department are loaded:', data);
          this.students = data;
          if (this.students.length === 0) {
            const modal = new bootstrap.Modal(
              this.noRecordsModal.nativeElement
            );
            modal.show();
            setTimeout(() => {
              modal.hide();
            }, 2000);
          }
          console.log('students are->', this.students);
        });
    }
  }

  onReset() {
    this.isReset = false;
    this.selectedCourse = null;
    this.selectedDept1 = null;
    this.selectedDept2 = null;
    this.students = [];
    this.isGetDetails = false;
  }

  onCheckBoxChange(event: any, studentId: number) {
    if (event.target.checked) {
      if (!this.selectedStudentsIds.includes(studentId)) {
        this.selectedStudentsIds.push(studentId);
      }
    } else {
      this.selectedStudentsIds = this.selectedStudentsIds.filter(
        (id) => id !== studentId
      );
    }
    console.log('selected students ids are->', this.selectedStudentsIds);
  }

  enrollStudent() {
    this.isEnrollStudent = true;
    if (this.isEnrollStudent && this.selectedStudentsIds.length == 0) {
      alert('atleast one student should be select!');
      return;
    }
    this.studentService
      .studentEnrollment(
        this.selectedStudentsIds,
        this.selectedCourse?.COURSE_ID
      )
      .subscribe({
        next: () => {
          console.log('students enrolled!!');
          const modal = new bootstrap.Modal(this.successModal.nativeElement);
          modal.show();

          setTimeout(() => {
            modal.hide();
          }, 2000);
          this.onSubmit();
          this.selectedStudentsIds = [];
        },
        error: (err: any) => {
          const modal = new bootstrap.Modal(
            this.alreadyEnrolledModal.nativeElement
          );
          modal.show();
          setTimeout(() => {
            modal.hide();
          }, 2000);
          console.error('error while saving student data!', err);
          this.onSubmit();
          this.selectedStudentsIds = [];
        },
      });
  }
}
