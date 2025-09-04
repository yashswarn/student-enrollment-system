import { Routes } from '@angular/router';
import { DepartmentFilterComponent } from './college_management_system/students_data/department-filter';
import { Student } from './college_management_system/Register_student/student';
import { ViewStudent } from './college_management_system/view-student/view-student';
import { StudentEnrollment } from './college_management_system/student-enrollment/student-enrollment';
import { Component } from '@angular/compiler';
import { EnrolledStudentsMarks } from './college_management_system/enrolled-students-marks/enrolled-students-marks';
import { Login } from './college_management_system/login/login';
import { Register } from './college_management_system/register/register';
import { Welcome } from './college_management_system/welcome/welcome';
import { Help } from './college_management_system/help/help';
import { Navbar } from './college_management_system/navbar/navbar';
import { authGuard } from './guard/auth-guard';
import { Dashboard } from './college_management_system/dashboard/dashboard';

export const routes: Routes = [
    {
        path:'',redirectTo:'home',pathMatch:'full',
    },
    {
        path:'registerstudent',
        component: Student,
        canActivate:[authGuard],
        data:{roles:['admin']}
    },
    {
        path:'registerstudent/:id',
        component:Student

    },
    {
        path:'studentsdata',
        component: DepartmentFilterComponent,
        canActivate:[authGuard],
        data:{roles:['admin','teacher']}
    },
    {
        path:'viewstudents',
        component:ViewStudent,
        canActivate:[authGuard],
        data:{roles:['department_admin','teacher']}
    },
    {
        path:'studentenrollment',
        component:StudentEnrollment,
        canActivate:[authGuard],
        data:{roles:['department_admin']}
    },
    {
        path:'enrolledstudentsmarks',
        component:EnrolledStudentsMarks,
        canActivate:[authGuard],
        data:{roles:['teacher']}
    },
    {
        path:'loginpage',
        component:Login,
    },
    {
        path:'registerpage',
        component:Register,
    },
    {
        path:'home',
        component:Welcome
    },
    {
        path:'help',
        component:Help,
        canActivate:[authGuard],
        data:{roles:['admin','teacher','department_admin']}
    },
    {
        path:'navbar',
        component:Navbar,
        canActivate:[authGuard],
        data:{roles:['admin','teacher','department_admin']}
    },
    {
        path:'dashboard',
        component:Dashboard
    }
];
