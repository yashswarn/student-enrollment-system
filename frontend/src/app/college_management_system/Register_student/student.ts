import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  Validators,
  AbstractControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
import { HttpClient } from '@angular/common/http';
import { StudentService } from '../../services/student.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css'],
})
export class Student implements OnInit {
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('alreadyRegisteredModal') alreadyRegisteredModal!: ElementRef;
  @ViewChild('updateStudentModal') updateStudentModal!: ElementRef;


  studentForm!: FormGroup;
  isSubmitted = false;
  minDate: string = '';
  maxDate: string = '';
  submittedStudents: any[] = [];
  selectedDept: any[] = [];
  departments: any[] = [];
  DEPARTMENT_ID: number = 0;
  studentId: number | null = null;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.studentId = this.route.snapshot.params['id'];
    console.log('student id at frontend angular is->', this.studentId);

    if (this.studentId) {
      // edit mode fetch student data using student id

      this.studentService
        .getStudentById(this.studentId)
        .subscribe((data: any) => {
          const studentDob=data;
          studentDob.dob=studentDob.dob.split('T')[0];
          console.log('student data of editable student is->', data);
          this.studentForm.patchValue(data);
        });
    } 
      this.studentService.getDepartments().subscribe((data: any) => {
        console.log('departments loaded:', data);
        this.departments = data;
      });
    

    const today = new Date();

    const min = new Date(
      today.getFullYear() - 60,
      today.getMonth(),
      today.getDay()
    );

    const max = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDay()
    );
    this.minDate = min.toISOString().split('T')[0];
    this.maxDate = max.toISOString().split('T')[0];

    this.studentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z\s]*$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|in|org)$'
          ),
        ],
      ],
      department: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      gender: ['', Validators.required],
      dob: ['', [Validators.required, this.AgeRangeValidator(16, 60)]],
    });
  }
  // now create a custom validators for age check
  AgeRangeValidator(minAge: number, maxAge: number) {
    return (control: AbstractControl) => {
      const dob = new Date(control.value);
      const today = new Date();
      if (isNaN(dob.getTime())) {
        return { invalidDate: true };
      }

      let age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= minAge && age <= maxAge ? null : { ageInvalid: true };
    };
  }

  formatDateToIndian(dateStr: string): string {
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  allowOnlyRangeDigits(event: KeyboardEvent) {
    const inputDigit = event.key;

    // it blocks the letters and special char
    if (!/^\d$/.test(inputDigit)) {
      event.preventDefault();
      return;
    }

    const inputField = event.target as HTMLInputElement;
    const currentValue = inputField.value;

    if (currentValue.length === 0 && !/^[6-9]$/.test(inputDigit)) {
      event.preventDefault();
      return;
    }

    const futureValue = currentValue + inputDigit;

    if (futureValue.length === 10) {
      const allSame = futureValue
        .split('')
        .every((char) => char == futureValue[0]);
      if (allSame) {
        event.preventDefault();
        alert('all digits can not be the same!!');
        return;
      }
    }

    const regex = /(\d)\1{4,}/;
    if (regex.test(futureValue)) {
      event.preventDefault();
      alert('more than 4 repeated digits are not allowed');
      return;
    }
  }

  // onSubmit() {
  //   if (this.studentForm.valid) {
  //     this.studentService.addStudents(this.studentForm.value).subscribe({
  //       next: () => {
  //         console.log('student data saved in db'),
  //         const dob = this.studentForm.get('dob')?.value;

  //     if (dob) {
  //       const formatDob = this.formatDateToIndian(dob);
  //       console.log('indian dob is->', formatDob);
  //       this.studentForm.get('dob')?.setValue(formatDob);
  //     } else {
  //       console.log('dob is missing');
  //     }

  //     // trim the name
  //     const trimName = this.studentForm.value.name.trim();
  //     this.studentForm.patchValue({ name: trimName });

  //     console.log('student registered:', this.studentForm.value);
  //     console.log('type of department->', typeof this.departments);
  //     this.submittedStudents.push(this.studentForm.value);
  //     console.log('submittted student is->', this.submittedStudents);
  //     this.isSubmitted = true;
  //     // alert("Student registered!")
  //     const modal = new bootstrap.Modal(this.successModal.nativeElement);
  //     modal.show();

  //     this.studentForm.reset();
  //   }

  //       error: (err: any) =>{
  //         console.error('error while saving student data', err),
  //          alert('all fields are mandatory');
  //     this.studentForm.markAllAsTouched();
  //     return;
  //       }
  //     )};

  // }

  // helper for html access

  onSubmit() {
    this.isSubmitted = true;

    // update
    if (this.studentForm.valid && this.studentId) {
      
      // Trim name
      const trimName = this.studentForm.value.name.trim();
      this.studentForm.patchValue({ name: trimName });

      // Call backend service
      this.studentService
        .updateStudent(this.studentId, this.studentForm.value)
        .subscribe({
          next: () => {
            console.log(
              'Student updated successfully:',
              this.studentForm.value
            );

            
            // Show success modal
            const modal = new bootstrap.Modal(this.updateStudentModal.nativeElement);
            modal.show();
            
            this.submittedStudents.push(this.studentForm.value);
            this.studentForm.reset();
            this.isSubmitted = false;
          },
          error: (err: any) => {
            console.error('Error while updating student data ', err);
            // alert('All fields are mandatory or invalid!');
            // this.studentForm.markAllAsTouched();

            const modal = new bootstrap.Modal(
              this.alreadyRegisteredModal.nativeElement
            );
            modal.show();
            // this.studentForm.reset();
          },
        });
    } else if (this.studentForm.valid) {
      // Format DOB
      // const dob = this.studentForm.get('dob')?.value;
      // if (dob) {
      //   const formatDob = this.formatDateToIndian(dob);
      //   this.studentForm.get('dob')?.setValue(formatDob);
      // } else {
      //   console.log('DOB is missing');
      // }

      // Trim name
      const trimName = this.studentForm.value.name.trim();
      this.studentForm.patchValue({ name: trimName });

      // Call backend service
      this.studentService.addStudents(this.studentForm.value).subscribe({
        next: () => {
          console.log('Student registered:', this.studentForm.value);

          this.submittedStudents.push(this.studentForm.value);

          // Show success modal
          const modal = new bootstrap.Modal(this.successModal.nativeElement);
          modal.show();

          this.studentForm.reset();
          this.isSubmitted = false;
        },
        error: (err: any) => {
          console.error('Error while saving student data', err);
          // alert('All fields are mandatory or invalid!');
          // this.studentForm.markAllAsTouched();

          const modal = new bootstrap.Modal(
            this.alreadyRegisteredModal.nativeElement
          );
          modal.show();
          this.studentForm.reset();
        },
      });
    } else {
      console.warn('Form is invalid');
      this.studentForm.markAllAsTouched();
    }
  }

  get f(): any {
    return this.studentForm.controls;
  }
}
