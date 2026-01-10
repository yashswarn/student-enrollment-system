import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-department-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-filter.component.html',
  styleUrls: ['./department-filter.component.css'],
})
export class DepartmentFilterComponent implements OnInit {
  departments: any[] = [];
  courses: any[] = [];
  allCourses: any[] = [];
  student: any[] = [];
  selectedDept: any = null;
  selectedCourse: any = null;
  filterClicked: boolean = false;
  DEPARTMENT_ID: number = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    // below call is a part of json

    this.studentService.getDepartments().subscribe((data: any) => {
      console.log('departments loaded by backend:', data);
      this.departments = data;
    });
  }

  onDepartmentChange() {
    // agr department selected h to, filter courses
    this.selectedCourse = null;
    this.filterClicked = false;
    this.student = [];
    if (this.selectedDept) {
      console.log('selected department is->', this.selectedDept);
      this.studentService
        .getCourses(this.selectedDept?.DEPARTMENT_ID)
        .subscribe((data: any) => {
          console.log('courses loaded:', data);
          this.courses = data;
          console.log('go ahead');
        });
    }
  }

  onCourseChange() {
    this.student = [];
    this.filterClicked = false;
  }

  onFilterApply() {
    this.filterClicked = true;
    if (!this.selectedCourse) {
      console.log('no course is selected');
      this.student = [];
      return;
    } else {
      console.log('selected course is->', this.selectedCourse);
      console.log('selected course id is->', this.selectedCourse.COURSE_ID);
      this.studentService
        .getStudents(this.selectedCourse?.COURSE_ID)
        .subscribe((data: any) => {
          console.log('students loaded:', data);
          this.student = data;

          console.log('filter applied', {
            department: this.selectedDept?.DEPARTMENT_NAME,
            course: this.selectedCourse?.COURSE_NAME,
            student: this.student.map((s) => ({
              name: s.Name,
              marks: s.marks,
              email: s.Email,
            })),
          });
        });
    }
  }
}
