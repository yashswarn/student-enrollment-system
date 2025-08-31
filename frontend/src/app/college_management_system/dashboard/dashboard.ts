import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Student } from '../Register_student/student';
import { StudentService } from '../../services/student.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
// import { NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [NgChartsModule, MatCardModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalStudents: number = 0;
  totalCourses: number = 0;
  activeEnrollments: number = 0;
  coursePopularity: any[] = [];

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Course Popularity' },
    },
    scales: {
      x: {
        offset: true,
        afterFit: (axis) => {
          axis.paddingRight = 30; // right side extra space
        },
        ticks: {
          // to small the text
          // callback:function(value:any,index:any,ticks:any){
          //   let label=this.getLabelForValue(value);
          //   return label.length>12?label.substring(0,12)+'...':label;
          // },
          maxRotation: 45,
          minRotation: 30,
          // autoSkip:false
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // barChartLabels:string[]=[];
  barChartType: ChartType = 'bar';

  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Enrollments',
      },
    ],
  };

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getCount().subscribe((data: any) => {
      this.totalStudents = data[0]?.total_students ?? 0;
      console.log('students count is such way that->', this.totalStudents);
    });
    this.studentService.getCourseCount().subscribe((data: any) => {
      this.totalCourses = data[0]?.total_courses ?? 0;
      console.log('total courses are->', this.totalCourses);
    });

    this.studentService.getActiveEnrollments().subscribe((data: any) => {
      this.activeEnrollments = data[0]?.active_enrollments ?? 0;
      console.log('active enrollments are->', this.activeEnrollments);
    });

    this.studentService.getCoursePopularity().subscribe((data: any) => {
      console.log('coruse popularity is->', data);
      this.coursePopularity = data;

      this.barChartData = {
        labels: data.map((d: any) => d.course_name),
        datasets: [
          {
            data: data.map((d: any) => d.count),
            label: 'Enrollments',
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(199, 199, 199, 0.6)',
            ],
            borderWidth: 1,
            borderColor: 'black',
          },
        ],
      };
    });
  }
}
