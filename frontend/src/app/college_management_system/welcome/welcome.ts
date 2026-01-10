import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {}
