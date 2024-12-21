import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';
import { Dessert } from './dessert.interface';

@Injectable({
  providedIn: 'root'
})
export class DessertService {
  private readonly baseUrl = `${environments.testBaseUrl}/desserts`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAll() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Dessert[]>(this.baseUrl).pipe(
      map(desserts => desserts.filter(h => h.branch === branch))
    );
  }

  getOne(id: string) {
    return this.http.get<Dessert>(`${this.baseUrl}/${id}`);
  }

  update(id: string, formData: FormData) {
    return this.http.patch<Dessert>(`${this.baseUrl}/${id}`, formData);
  }

  create(formData: FormData) {
    return this.http.post<Dessert>(this.baseUrl, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getImageUrl(imgPath: string): string {
    const filename = imgPath.split('/').pop();
    return `${environments.testBaseUrl}/desserts/file/${filename}`;
  }


}
