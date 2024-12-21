import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Extra } from './extra.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {
  private readonly baseUrl = `${environments.testBaseUrl}/extras`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAll() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Extra[]>(this.baseUrl).pipe(
      map(extras => extras.filter(h => h.branch === branch))
    );
  }

  getOne(id: string) {
    return this.http.get<Extra>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData) {
    // Convert FormData to proper format before sending
    const data = {
      name: formData.get('name'),
      price: formData.get('price'),
      branch: formData.get('branch'),
      available: formData.get('available') === 'true'
    };

    return this.http.post<Extra>(this.baseUrl, data);
  }

  update(id: string, formData: FormData) {
    const data = {
      name: formData.get('name'),
      price: formData.get('price'),
      branch: formData.get('branch'),
      available: formData.get('available') === 'true'
    };

    return this.http.patch<Extra>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
