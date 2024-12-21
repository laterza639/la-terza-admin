import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Schedule } from './schedule.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly baseUrl = `${environments.testBaseUrl}/schedule`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getByBranch() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Schedule>(`${this.baseUrl}/branch?branch=${branch}`);
  }

  update(id: string, data: Partial<Schedule>) {
    return this.http.patch<Schedule>(`${this.baseUrl}/${id}`, data);
  }

  create(data: Omit<Schedule, 'id'>) {
    return this.http.post<Schedule>(this.baseUrl, data);
  }
}