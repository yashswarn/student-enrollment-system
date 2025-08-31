import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../../services/auth';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('invalidModal') invalidModal!: ElementRef;

  loginForm: FormGroup;
  isSubmitted = false;
  isLoggedIn=false;
  isShowPassword = false;
  submittedLogin: any[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private authService: Auth
  ) {
    this.loginForm = fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|in|org)$'
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ngOnInit() {
  //   if (this.authService.isLoggedIn()) {
  //     const roles = this.authService.getUserRoles();

  //     if (roles.includes('admin')) {
  //       // navigate to admin panel
  //       this.router.navigate(['/studentenrollment']);
  //     } else if (roles.includes('student')) {
  //       // navigate to student panel
  //       this.router.navigate(['/registerstudent']);
  //     }
  //   }
  // }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      console.log('Form is invalid!');
      return;
    } else {
      console.log('Forms data:', this.loginForm.value);
      this.submittedLogin = this.loginForm.value;
      this.studentService.formSubmit(this.submittedLogin).subscribe({
        next: (res: any) => {
          console.log('submitted login added!!');
          const token = res.token;

          sessionStorage.setItem('token', token);
          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            sessionStorage.clear();
            this.router.navigate(['/loginpage']);
          }
          const roles = decoded.role;
          const course=decoded.course;

          console.log("roles and course are->",roles,course);

          sessionStorage.setItem('roles', JSON.stringify(roles));

          if (roles.includes('admin')) {
            // navigate to admin panel
            this.router.navigate(['/registerstudent']);
          } else if (roles.includes('teacher')) {
            // navigate to student panel
            this.router.navigate(['/enrolledstudentsmarks']);
          }
          else if(roles.includes('department_admin')){
            this.router.navigate(['/studentenrollment'])
          }

          const modal = new bootstrap.Modal(
            this.successModal.nativeElement);
          modal.show();
          setTimeout(()=>{
            modal.hide();
          },2000)
          // this.loginForm.reset();
          this.isSubmitted = false;
        },
        error: (err: any) => {
          console.log('error while saving login deatails:', err);
          const modal = new bootstrap.Modal(this.invalidModal.nativeElement);
          modal.show();
          setTimeout(()=>{
            modal.hide();
          },2000)
          // this.loginForm.reset();
          this.isSubmitted = false;
        },
      });
    }
  }
}
