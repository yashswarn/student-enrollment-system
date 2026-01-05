import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getDepartments() {
    return this.http.get(`${environment.backendUrl}/departments`);
  }

  getCourses(DEPARTMENT_ID: number) {
    console.log('department id is->', DEPARTMENT_ID);
    if (!DEPARTMENT_ID) {
      return throwError(
        () =>
          new Error('department is not selected or department id is not find')
      );
    }
    return this.http.get(
      `${environment.backendUrl}/courses?departmentId=${DEPARTMENT_ID}`
    );
  }

  getStudents(COURSE_ID: number) {
    console.log('course id is->', COURSE_ID);
    if (!COURSE_ID) {
      return throwError(() => new Error('course is not selected yet'));
    }
    return this.http.get(
      `${environment.backendUrl}/students?courseId=${COURSE_ID}`
    );
  }

  getStudentById(studentId:number){
    return this.http.get(`${environment.backendUrl}/students/getstudentbyid/${studentId}`)
  }

  updateStudent(studentId:number,submittedStudents:any){
    return this.http.put(
      `${environment.backendUrl}/students/update/${studentId}`,
      submittedStudents
    );
  }

  addStudents(submittedStudents: any) {
    console.log(
      'student data of the registered student is->',
      submittedStudents
    );
    return this.http.post(
      `${environment.backendUrl}/students/add`,
      submittedStudents
    );
  }

  getAllStudents() {
    return this.http.get(`${environment.backendUrl}/students/get`);
  }

  getStudentsOfDept(DEPARTMENT_ID: number, COURSE_ID: number) {
    if (!DEPARTMENT_ID) {
      console.log('departmentId not found');
      return;
    }
    if (!COURSE_ID) {
      console.log('course id not found!');
      return;
    } else {
      return this.http.get(
        `${environment.backendUrl}/students/for-enrollment?departmentId=${DEPARTMENT_ID}&courseId=${COURSE_ID}`
      );
    }
  }

  getStudentsOfCourse(DEPARTMENT_ID: number, COURSE_ID: number) {
    if (!DEPARTMENT_ID) {
      console.log('departmentId not found');
      return;
    }
    if (!COURSE_ID) {
      console.log('course id not found!');
      return;
    }
    return this.http.get(
      `${environment.backendUrl}/students/for-marks?departmentId=${DEPARTMENT_ID}&courseId=${COURSE_ID}`
    );
  }

  studentEnrollment(selectedStudentsIds: any, COURSE_ID: number) {
    if (!selectedStudentsIds) {
      alert('atleast one student should be selected');
    }
    if (!COURSE_ID) {
      alert('course id not found');
    }
    console.log(
      'selected students ids at services side are->',
      selectedStudentsIds
    );
    console.log('selected course id at services side are->', COURSE_ID);
    return this.http.post(`${environment.backendUrl}/enrollments`, {
      studentIds: selectedStudentsIds,
      courseId: COURSE_ID,
    });
  }

  studentMarks(selectedStudentsMarks: any, COURSE_ID: number) {
    console.log(
      'selected students marks and ids at servies side are-?>',
      selectedStudentsMarks
    );
    if (!COURSE_ID) {
      alert('Course ID not found');
      return;
    }

    const studentsArray = [];

    for (let studentId in selectedStudentsMarks) {
      const mark = selectedStudentsMarks[studentId];
      studentsArray.push({
        studentId: parseInt(studentId, 10),
        marks: mark,
      });
    }

    // console.log("student array is->",studentsArray)

    const payload = {
      courseId: COURSE_ID,
      students: studentsArray,
    };

    console.log('Payload to be sent:', payload);

    return this.http.post(`${environment.backendUrl}/enrollments/marks`, payload);
  }

  formSubmit(submittedLogin: any) {
    console.log('submitted login at services side are->', submittedLogin);
    return this.http.post(
      `${environment.backendUrl}/login`,
      submittedLogin
    );
  }

  RegisterFormSubmit(submittedRegister: any) {
    console.log('submitted login at services side are->', submittedRegister);
    return this.http.post(
      `${environment.backendUrl}/register/registerdetails`,
      submittedRegister
    );
  }

  getCount(){
    return this.http.get(`${environment.backendUrl}/students/count`);
  }

  getCourseCount(){
    return this.http.get(`${environment.backendUrl}/courses/coursecount`);
  }

  getActiveEnrollments(){
    // return this.http.get('http://localhost:3000/courses/activeenrollments')
    return this.http.get(`${environment.backendUrl}/courses/activeenrollments`);
  }

  getCoursePopularity(){
    return this.http.get(`${environment.backendUrl}/enrollments/coursepopularity`)
  }

  getSearchedName(page:number, limit:number, searchedName:string=''){
    return this.http.get(`${environment.backendUrl}/students/getsearchedname?page=${page}&limit=${limit}&searchedName=${searchedName}`)
  }

  deleteStudent(Student_id:number){
    return this.http.delete(`${environment.backendUrl}/students/deletestudent/${Student_id}`)
  }
}
