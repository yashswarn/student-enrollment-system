import { Component, EventEmitter, Output,ElementRef,ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Dashboard } from '../dashboard/dashboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MatMenuModule,MatButtonModule,MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @ViewChild('home') homeSection!: ElementRef;
  @ViewChild('about') aboutSection!: ElementRef;
  @ViewChild('keyfeatures') keyFeaturesSection!: ElementRef;
  @ViewChild('contact') contactSection!: ElementRef;

  @Output() scrollSection=new EventEmitter<string>();
  
  constructor(public authService:Auth, private router:Router){}


  logout(){
    this.authService.logout();
  }

  scrollToSection(sectionId: string) {
    if (this.router.url==='/') {
      // already on home page 
      document.getElementById(sectionId)?.scrollIntoView({behavior:'smooth'});
    }
    else{
      // home page nhi h
      this.router.navigate(['/']).then(()=>{
        setTimeout(()=>{
          document.getElementById(sectionId)?.scrollIntoView({behavior:'smooth'})
        },200)
      })
    }

  }

}
