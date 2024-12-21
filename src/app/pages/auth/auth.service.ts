import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError, concatMap } from "rxjs";
import { environments } from '../../../environments/environments';
import { AuthStatus, LoginStatusResponse } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private selectedBranchSubject = new BehaviorSubject<string>('');
  public selectedBranch$ = this.selectedBranchSubject.asObservable();
  private _currentUser = signal<LoginStatusResponse | null>(null);

  private readonly baseUrl = environments.testBaseUrl;
  private http = inject(HttpClient);

  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private readonly SUPER_ADMIN_EMAIL = 'luis@gmail.com';
  private readonly SUPER_ADMIN_ID = 'cd7cb4db-19ed-49a1-9e64-63e50a89a585';

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private updateUserBranch(branch: string): Observable<LoginStatusResponse> {
    const url = `${this.baseUrl}/auth/${this.SUPER_ADMIN_ID}`;

    return this.http.patch<LoginStatusResponse>(url, { branch }).pipe(
      tap(response => {
        console.log('Branch update response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(err => {
        console.error('Branch update error:', err);
        return throwError(() => err.error?.message || 'Failed to update branch');
      })
    );
  }

  login(email: string, password: string, branch: string): Observable<Boolean> {
    const url = `${this.baseUrl}/auth/login`;

    // For super-admin user
    if (email === this.SUPER_ADMIN_EMAIL) {
      console.log('Starting super admin flow - updating branch first');

      return this.updateUserBranch(branch).pipe(
        concatMap(() => {
          console.log('Branch updated, proceeding with login');
          return this.http.post<LoginStatusResponse>(url, { email, password, branch });
        }),
        tap(res => {
          console.log('Login response:', res);
          this._currentUser.set(res);
          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', res.token);
        }),
        map(() => true),
        catchError(err => {
          console.error('Error in super admin flow:', err);
          return throwError(() => err.error?.message || 'Authentication failed');
        })
      );
    }

    // For regular users
    console.log('Starting regular user login');
    return this.http.post<LoginStatusResponse>(url, { email, password, branch }).pipe(
      tap(res => {
        this._currentUser.set(res);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', res.token);
      }),
      map(() => true),
      catchError(err => throwError(() => err.error?.message || 'Authentication failed'))
    );
  }

  checkAuthStatus(): Observable<Boolean> {
    const url = `${this.baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<LoginStatusResponse>(url, { headers }).pipe(
      map((res) => {
        this._currentUser.set(res);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', res.token);
        return true;
      }),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        this.logout();
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  setSelectedBranch(branchId: string) {
    const branchName = branchId === '1' ? 'Casa Matriz' : 'Suc-1';
    this.selectedBranchSubject.next(branchName);
  }

  getCurrentBranch(): string {
    const user = this._currentUser();
    return user ? user.branch : '';
  }

  getCurrentRole(): string[] {
    const user = this._currentUser();
    return user ? user.roles : [];
  }
}