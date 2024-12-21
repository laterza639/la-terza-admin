// hamburger.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { Hamburger } from './hamburguer.interface';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HamburgerService {
  private readonly baseUrl = `${environments.testBaseUrl}/hamburguers`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAll() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Hamburger[]>(this.baseUrl).pipe(
      map(hamburgers => hamburgers.filter(h => h.branch === branch))
    );
  }

  getOne(id: string) {
    return this.http.get<Hamburger>(`${this.baseUrl}/${id}`);
  }

  update(id: string, formData: FormData) {
    return this.http.patch<Hamburger>(`${this.baseUrl}/${id}`, formData);
  }

  create(formData: FormData) {
    return this.http.post<Hamburger>(this.baseUrl, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getImageUrl(imgPath: string): string {
    const filename = imgPath.split('/').pop();
    return `${environments.testBaseUrl}/hamburguers/file/${filename}`;
  }
}