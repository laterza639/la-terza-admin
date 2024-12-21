import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environments.testBaseUrl}/auth`;
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  create(userData: { email: string; password: string; branch: string }) {
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  update(id: string, userData: { branch: string }) {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, userData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}