import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';
declare var bootstrap: any;

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './view-student.html',
  styleUrl: './view-student.css',
})
export class ViewStudent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  viewStudents: any[] = [];
  searchedName: string = '';
  searchedStudents: any[] = [];
  isSearch: boolean = false;
  currentPage = 1;
  totalPages = 0;
  limit = 6;
  Student_id: number = 0;

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit() {
    this.loadStudents();
  }

  onSearchChange(value: string) {
    console.log('searched name is->', value);
    this.searchedName = value;
    if (value.trim() === '') {
      this.isSearch = false;
      this.currentPage = 1;
      this.loadStudents();
    }
  }

  onSearch() {
    if (this.searchedName.trim() === '') {
      this.isSearch = false;
      this.currentPage = 1;
      alert('Please type the name to be searched');
      this.loadStudents();
      return;
    } else {
      this.isSearch = true;
      this.currentPage = 1;

      this.studentService
        .getSearchedName(this.currentPage, this.limit, this.searchedName)
        .subscribe((data: any) => {
          this.searchedStudents = data.students || data;
          this.totalPages = data.totalPages || 0;
          if (this.searchedStudents.length === 0) {
            alert('No student found');
            this.isSearch = false;
            this.loadStudents();

            return;
          }
          this.formatedDates(this.searchedStudents);
        });
    }
  }

  loadStudents() {
    this.studentService
      .getSearchedName(this.currentPage, this.limit, this.searchedName)
      .subscribe((data: any) => {
        this.viewStudents = data.students || data; // fallback if API returns array
        this.totalPages = data.totalPages || 0;
        this.formatedDates(this.viewStudents);
      });
  }

  formatedDates(students: any[]) {
    students.forEach((student) => {
      const dob = new Date(student.Date_of_Birth);

      const day = dob.getDate().toString().padStart(2, '0');
      const month = (dob.getMonth() + 1).toString().padStart(2, '0');
      const year = dob.getFullYear();
      student.Date_of_Birth = `${day}-${month}-${year}`;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.isSearch ? this.onSearch() : this.loadStudents();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.isSearch ? this.onSearch() : this.loadStudents();
    }
  }

  deleteStudent(Student_id: number) {
    console.log('student id at frontend is->', Student_id);
    this.studentService.deleteStudent(Student_id).subscribe({
      next: () => {
        console.log('student deleted');
        this.loadStudents();

        const modal = new bootstrap.Modal(this.deleteModal.nativeElement);
        modal.show();

        setTimeout(() => {
          modal.hide();
        }, 2000);
      },
      error: (error: any) => {
        console.log('error in deleting student data');
      },
    });
  }

  UpdateStudent(Student_id: number) {
    this.router.navigate(['/registerstudent', Student_id]);
  }
}
