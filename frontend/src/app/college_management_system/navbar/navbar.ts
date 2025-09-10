import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Dashboard } from '../dashboard/dashboard';
import { Router } from '@angular/router';
import { concatAll } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @ViewChild('home') homeSection!: ElementRef;
  @ViewChild('about') aboutSection!: ElementRef;
  @ViewChild('keyfeatures') keyFeaturesSection!: ElementRef;
  @ViewChild('contact') contactSection!: ElementRef;

  @Output() scrollSection = new EventEmitter<string>();

  roles: string[] = [];

  constructor(public authService: Auth, public router: Router) {}

  ngOnInit() {
    this.authService.roles$.subscribe(roles=>{
      this.roles=roles;
      console.log('roles at navbar.ts file is->', this.roles);
    })
    // this.roles = this.authService.getUserRoles();
  }

  isViewStudents:boolean=false;


  hasRole(role: string): boolean {
    console.log('role at navbar.ts file is->', role);
    return this.roles.includes(role);
  }

  viewStudents(){
    this.isViewStudents=true;
  }

  logout() {
    this.authService.logout();
    this.roles=[];
    // this.isViewStudents=false;
  }

  scrollToSection(sectionId: string) {
    if (this.router.url === '/') {
      // already on home page
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // home page nhi h
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      });
    }
  }
}
