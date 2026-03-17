import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './auth.config';
import { Router } from '@angular/router';
import { Observable, of, switchMap, map, BehaviorSubject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminBaseUrl = `http://localhost:8080/admin/realms/mutra`;
  private baseUrl="https://localhost:7205";

  constructor(
    private oauthService: OAuthService, 
    private router: Router,
    private http: HttpClient
  ) {}

  async initAuth(): Promise<void> {
    this.oauthService.configure(authCodeFlowConfig);
    // this.oauthService.setStorage(localStorage);
    const success = await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    
    if (success && this.oauthService.hasValidAccessToken()) {
      this.oauthService.setupAutomaticSilentRefresh();
      this.loadPlanForCurrentUser();
      if (this.router.url.includes('code=') || window.location.search.includes('code=')) {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  login() {
    console.log("loging called sugan...");
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getUserDetails() {
    if (!this.isLoggedIn) return null;
    const claims = this.identityClaims;
    return claims ? {
      name: claims['name'] || claims['preferred_username'],
      email: claims['email']
    } : null;
  }

  getUserName(): string | null {
    if (!this.isLoggedIn) return null;
    const claims = this.identityClaims;
    return claims ? (claims['preferred_username'] || claims['sub']) : null;
  }

  getUserRoles(): string[] {
    const accessToken = this.oauthService.getAccessToken();
    if (!accessToken) return [];
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.realm_access?.roles || [];
    } catch (e) {
      return [];
    }
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes('admin') || roles.includes(role);
  }

  private get adminHeader() {
    return {
      headers: { 'Authorization': `Bearer ${this.oauthService.getAccessToken()}` }
    };
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/users`, this.adminHeader);
  }

  updateUser(userId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.adminBaseUrl}/users/${userId}`, updatedData, this.adminHeader);
  }

  getRoleByName(roleName: string): Observable<any> {
    return this.http.get<any>(`${this.adminBaseUrl}/roles/${roleName}`, this.adminHeader);
  }

  getUserAssignedRoles(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/users/${userId}/role-mappings/realm`, this.adminHeader);
  }

  deleteUserRole(userId: string, roles: any[]): Observable<any> {
    return this.http.delete(`${this.adminBaseUrl}/users/${userId}/role-mappings/realm`, { 
      ...this.adminHeader, 
      body: roles 
    });
  }

  assignRoleToUser(userId: string, roles: any[]): Observable<any> {
    return this.http.post(`${this.adminBaseUrl}/users/${userId}/role-mappings/realm`, roles, this.adminHeader);
  }

  createUserWithFullPermissions(userData: any, selectedRole: string): Observable<any> {
    const userPayload = {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      enabled: true,
      emailVerified: true,
      credentials: [{ type: "password", value: userData.password, temporary: false }]
    };

    return this.http.post(`${this.adminBaseUrl}/users`, userPayload, { 
      ...this.adminHeader, 
      observe: 'response' 
    }).pipe(
      switchMap((response: HttpResponse<any>) => {
        const fullUrl = response.headers.get('Location');
        console.log('Full Location Header URL:', fullUrl);
        const userId = fullUrl?.split('/').pop() || '';
        console.log('Extracted User ID:', userId);

        return this.getRoleByName(selectedRole).pipe(
          switchMap(roleObj => this.assignRoleToUser(userId, [roleObj])),
          switchMap(() => {
            if (selectedRole !== 'admin') return of(null);
            return this.elevateToAdminPrivileges(userId);
          })
        );
      })
    );
  }

  getClientIdByInternalName(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/clients`, this.adminHeader).pipe(
      map(clients => clients.filter(c => c.clientId === clientId))
    );
  }

  getClientRoles(clientUuid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/clients/${clientUuid}/roles`, this.adminHeader);
  }

  assignClientRolesToUser(userId: string, clientUuid: string, roles: any[]): Observable<any> {
    return this.http.post(`${this.adminBaseUrl}/users/${userId}/role-mappings/clients/${clientUuid}`, roles, this.adminHeader);
  }

  elevateToAdminPrivileges(userId: string): Observable<any> {
    return this.getClientIdByInternalName('realm-management').pipe(
      switchMap(clients => {
        if (!clients || clients.length === 0) throw new Error("Client 'realm-management' not found.");
        const clientUuid = clients[0].id;
        return forkJoin({
          allClientRoles: this.getClientRoles(clientUuid),
          studentRole: this.getRoleByName('student')
        }).pipe(
          switchMap(({ allClientRoles, studentRole }) => {
            const privs = [
              'manage-users', 'view-users', 'query-groups', 
              'query-users', 'view-realm', 'assign-roles', 
              'view-clients', 'query-clients'
            ];
            const clientRolesToAssign = allClientRoles.filter(r => privs.includes(r.name));
            return forkJoin([
              this.assignClientRolesToUser(userId, clientUuid, clientRolesToAssign),
              this.assignRoleToUser(userId, [studentRole]) 
            ]);
          })
        );
      })
    );
  }

  private planSubject = new BehaviorSubject<string>('free');
  currentPlan$ = this.planSubject.asObservable();

  updatePlan(planId: string) {
    const userName = this.getUserName();
    const body = { username: userName, planId: planId };
    
    this.http.post(`${this.baseUrl}/api/yoga/plan`, body).subscribe(() => {
      this.planSubject.next(planId);
    });
  }

  loadPlanForCurrentUser() {
    const userName = this.getUserName();
    if (!userName) return;

    this.http.get<string>(`${this.baseUrl}/api/yoga/plan/${userName}`, { responseType: 'text' as 'json' })
      .subscribe(plan => {
        this.planSubject.next(plan);
      });
  }

}