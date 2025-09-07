import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import { DepartmentFilterComponent } from './college_management_system/students_data/department-filter';
// import { Student } from './college_management_system/Register_student/student';
// import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Auth } from './services/auth';
// import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { Navbar } from './college_management_system/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [Navbar, NgChartsModule,CommonModule, RouterModule,RouterOutlet,MatMenuModule,MatButtonModule,MatIconModule,ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected title = 'college-curriculum';

  constructor(public authService:Auth){}

  // logout(){
  //   this.authService.logout();
  // }
}
