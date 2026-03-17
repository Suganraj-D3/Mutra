import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  title:string="Mutra";
  user: any;
  newUser = { username: '', email: '', firstName: '', lastName: '', password: '' };
  selectedRole = 'student';
  message = '';
  isError = false;
  allUsers: any[] = [];
  selectedUser: any = null;
  editData: any = {};

  @ViewChild('editSection') editSection!: ElementRef;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn && this.auth.hasRole('admin')) {
      this.user = this.auth.getUserDetails();
      this.loadUsers();
    } else {
      this.message = "Access Denied: Admin privileges required.";
      this.isError = true;
    }
  }

  loadUsers() {
    this.auth.getUsers().subscribe({
      next: (data) => this.allUsers = data,
      error: (err) => {
        this.message = "Failed to load users.";
        this.isError = true;
      }
    });
  }

  onAddUser() {
    this.auth.createUserWithFullPermissions(this.newUser, this.selectedRole).subscribe({
      next: () => {
        this.message = `Successfully created ${this.selectedRole}: ${this.newUser.username}`;
        this.isError = false;
        this.loadUsers();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.errorMessage || "Registration failed.";
        this.isError = true;
      }
    });
  }

  resetForm() {
    this.newUser = { username: '', email: '', firstName: '', lastName: '', password: '' };
    setTimeout(() => {
    this.message = '';
  }, 3000);
  }

  selectUserForEdit(user: any) {
    this.selectedUser = user;
    this.editData = { 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email 
    };

    setTimeout(() => {
      if (this.editSection) {
        this.editSection.nativeElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 100);
  }

  onUpdate() {
    if (!this.selectedUser) return;

    const userId = this.selectedUser.id;
    const isAdmin = this.selectedRole === 'admin';

    this.auth.updateUser(userId, this.editData).pipe(

      switchMap(() => this.auth.getUserAssignedRoles(userId)),
      
      switchMap((currentRoles) => {
        const rolesToRemove = currentRoles.filter(
          r => r.name !== 'default-roles-mutra'
        );
        console.log('Roles being sent for deletion:', rolesToRemove);
        if (rolesToRemove.length === 0) return of(null);
        return this.auth.deleteUserRole(userId, rolesToRemove);
      }),

      switchMap(() => this.auth.getRoleByName(this.selectedRole)),

      switchMap((roleObj) =>
        this.auth.assignRoleToUser(userId, [roleObj])
      ),

      switchMap(() => {
        if (!isAdmin) return of(null);
        return this.auth.elevateToAdminPrivileges(userId);
      })

    ).subscribe({
      next: () => {
        this.message = isAdmin
          ? "Admin updated with full privileges!"
          : "Member updated.";

        this.loadUsers();
        this.selectedUser = null;
        this.resetForm();
        this.isError = false;
      },
      error: (err) => {
        console.error(err);
        this.message = err.message || "Update failed.";
        this.isError = true;
      }
    });
  }

}
