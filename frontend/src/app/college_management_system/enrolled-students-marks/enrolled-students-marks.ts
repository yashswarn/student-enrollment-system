import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
declare var bootstrap: any;

@Component({
  selector: 'app-enrolled-students-marks',
  imports: [CommonModule, FormsModule],
  templateUrl: './enrolled-students-marks.html',
  styleUrl: './enrolled-students-marks.css',
})
export class EnrolledStudentsMarks implements OnInit {
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('alreadyAssignModal') alreadyAssignModal!: ElementRef;
  @ViewChild('noStudentsModal') noStudentsModal!:ElementRef;

  constructor(private studentService: StudentService) {}

  selectedDept1: any = null;
  selectedDept2: any = null;
  selectedCourse: any = null;
  isGetDetails: boolean = false;
  isReset: boolean = false;
  students: any[] = [];
  departments: any = [];
  courses: any[] = [];
  selectedStudentsMarks: { [studentId: number]: number } = {};
  isAssignMarks: boolean = false;

  ngOnInit() {
    this.studentService.getDepartments().subscribe((data) => {
      console.log('departments loaded:', data);
      this.departments = data;
    });
  }

  onDepartmentChange() {
    if (!this.selectedDept1) {
      console.log('department not found');
    } else {
      this.studentService
        .getCourses(this.selectedDept1.DEPARTMENT_ID)
        .subscribe((data: any) => {
          console.log('couses loaded:', data);
          this.courses = data;
        });
    }
  }

  oninputChange(event: any, studentId: number) {
    const marks = parseInt(event.target.value, 10);
    console.log('marks', marks);
    if (isNaN(marks) || marks < 0 || marks > 100 || !Number.isInteger(marks)) {
      event.target.value = '';
      delete this.selectedStudentsMarks[studentId];
      alert('Please enter a valid marks from (0-100) no decimal or alphabets');
      return;
    } else {
      this.selectedStudentsMarks[studentId] = marks;

      console.log(
        'selected students marks and ids are->',
        this.selectedStudentsMarks
      );
      console.log(
        'selected students ids are->',
        Object.keys(this.selectedStudentsMarks)
      );
      console.log(
        'selected students marks are->',
        Object.values(this.selectedStudentsMarks)
      );
    }
  }

  preventInavalidChar(event: KeyboardEvent) {
    const invalidChars = ['-', '+', '.', 'e', 'E'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.isGetDetails = true;
    if (
      (!this.selectedCourse || !this.selectedDept1 || !this.selectedDept2) &&
      this.isGetDetails
    ) {
      alert('All fields are mandatory');
      return;
    } else {
      this.studentService
        .getStudentsOfCourse(
          this.selectedDept2.DEPARTMENT_ID,
          this.selectedCourse.COURSE_ID
        )
        ?.subscribe((data: any) => {
          console.log(
            'students of the selected department and course are loaded->',
            data
          );
          this.students = data;
          if(this.students.length==0){
            const modal = new bootstrap.Modal(this.noStudentsModal.nativeElement);
            modal.show();
            setTimeout(()=>{
            modal.hide();
          },2000)
            console.log("no student data found")
            this.selectedDept1=null;
            this.selectedDept2=null;
            this.selectedCourse=null;
            this.isGetDetails=false;
          }
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

  assignMarks() {
    this.isAssignMarks = true;
    if (
      this.isAssignMarks &&
      Object.values(this.selectedStudentsMarks).length == 0
    ) {
      alert('Marks should be assigned to atleast one student!');
      return;
    }

    this.studentService
      .studentMarks(this.selectedStudentsMarks, this.selectedCourse?.COURSE_ID)
      ?.subscribe({
        next: () => {
          console.log('students assigned marks!!');
          const modal = new bootstrap.Modal(this.successModal.nativeElement);
          modal.show();
          setTimeout(()=>{
            modal.hide();
          },2000)
          this.selectedStudentsMarks = {};
          this.onSubmit();
          
        },
        error: (err: any) => {
          const modal = new bootstrap.Modal(
            this.alreadyAssignModal.nativeElement
          );
          modal.show();
          setTimeout(()=>{
            modal.hide();
          },2000)
          console.log('marks already assign to student!!');
          console.error('error while saving student data!', err);
          this.selectedStudentsMarks = {};
          this.onSubmit();
          // this.isGetDetails = false;
          this.isAssignMarks=false
        },
      });
  }
}
