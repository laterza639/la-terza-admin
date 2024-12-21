import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Snack } from './snack.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  private readonly baseUrl = `${environments.testBaseUrl}/snacks`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAll() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Snack[]>(this.baseUrl).pipe(
      map(snacks => snacks.filter(h => h.branch === branch))
    );
  }

  getOne(id: string) {
    return this.http.get<Snack>(`${this.baseUrl}/${id}`);
  }

  update(id: string, formData: FormData) {
    return this.http.patch<Snack>(`${this.baseUrl}/${id}`, formData);
  }

  create(formData: FormData) {
    return this.http.post<Snack>(this.baseUrl, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getImageUrl(imgPath: string): string {
    const filename = imgPath.split('/').pop();
    return `${environments.testBaseUrl}/snacks/file/${filename}`;
  }

}
