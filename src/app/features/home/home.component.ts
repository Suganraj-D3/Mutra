import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  Abouttext: string = `At MUTRA, we bridge the gap between traditional yoga and the modern lifestyle. Our mission is to provide a digital sanctuary for those seeking a deeper connection to themselves. Through tailored guidance and a focus on holistic health, we empower you to build a stronger body and a clearer mind, helping you navigate your world with grace and resilience.<br><br>In a fast-paced world, we offer the tools to cultivate both physical strength and mental clarity. Whether you are a dedicated practitioner or just beginning your path, our platform provides the essential balance you need to truly thrive.`;
  title: string = "MUTRA";
  roleText: string = "Homepage";
  isLoggedIn: boolean = false;
  items: MenuItem[] = [];

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.items = [
      { label: 'Home', command: () => this.scrollToSection('home') },
      { label: 'About', command: () => this.scrollToSection('about') }
    ];
    if(this.isLoggedIn)
    {
      this.items.push(
        { label: 'Dashboard', routerLink: '/dashboard' }
      );
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}