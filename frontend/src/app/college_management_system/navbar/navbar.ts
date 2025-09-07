import { Component, EventEmitter, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MatMenuModule,MatButtonModule,MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  // @ViewChild('home') homeSection!: ElementRef;
  // @ViewChild('about') aboutSection!: ElementRef;
  // @ViewChild('keyfeatures') keyFeaturesSection!: ElementRef;
  // @ViewChild('contact') contactSection!: ElementRef;

  @Output() scrollSection=new EventEmitter<string>();
  
  constructor(public authService:Auth){}


  logout(){
    this.authService.logout();
  }

  scrollToSection(section: string) {
    // switch (section) {
    //   case 'home':
    //     this.homeSection.nativeElement.scrollIntoView({
    //       behavior: 'smooth',
    //     });
    //     break;

    //   case 'about':
    //     this.aboutSection.nativeElement.scrollIntoView({
    //       behavior: 'smooth',
    //     });
    //     break;

    //   case 'keyfeatures':
    //     this.keyFeaturesSection.nativeElement.scrollIntoView({
    //       behavior: 'smooth',
    //     });
    //     break;

    //   case 'contact':
    //     this.contactSection.nativeElement.scrollIntoView({
    //       behavior: 'smooth',
    //     });
    //     break;
    // }

    this.scrollSection.emit(section);
  }

}
