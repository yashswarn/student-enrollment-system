import { Component, ElementRef, ViewChild } from '@angular/core';
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
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('alreadyRegisteredModal') alreadyRegisteredModal!: ElementRef;

  registerForm: FormGroup;
  isSubmitted = false;
  isShowPassword = false;
  submittedRegister: any[] = [];

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.registerForm = fb.group({
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

  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      console.log('Form is invalid!');
      return;
    } else {
      console.log('Forms data:', this.registerForm.value);
      this.submittedRegister = this.registerForm.value;
      this.studentService.RegisterFormSubmit(this.submittedRegister).subscribe({
        next: () => {
          console.log('submitted register added!!');
          const modal = new bootstrap.Modal(this.successModal.nativeElement);
          modal.show();
          setTimeout(() => {
            modal.hide();
          }, 2000);
          this.registerForm.reset();
          this.isSubmitted = false;
        },
        error: (err: any) => {
          console.log('error while saving register deatails:', err);
          const modal = new bootstrap.Modal(
            this.alreadyRegisteredModal.nativeElement
          );
          modal.show();
          setTimeout(() => {
            modal.hide();
          }, 2000);
          this.registerForm.reset();
          this.isSubmitted = false;
        },
      });
    }
  }
}
