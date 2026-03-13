import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: string = "Mutra";
  roleText: string = "Dashboard";
  username: string = "";
  avatar: string = "";
  isLoggedIn: boolean = false;
  userexist: boolean = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn) {
      const claims = this.authService.identityClaims;
      if (claims) {
        this.username = claims['name'] || claims['preferred_username'] || "User";
        this.avatar = this.username.charAt(0).toUpperCase();
        this.userexist = true;
      }
      this.setUserRoleTitle();
    }
  }
  
  setUserRoleTitle() {
    const roles = this.authService.getUserRoles();
    
    if (roles.includes('admin')) {
      this.roleText = 'Admin Dashboard';
    } else if (roles.includes('student')) {
      this.roleText = 'Student Dashboard';
    } else if(roles.includes('instructor')) {
      this.roleText = 'Instructor Dashboard';
    } 
    else {
      this.roleText = 'Guest';
    }
  }

  logout() {
    this.authService.logout();
  }
}