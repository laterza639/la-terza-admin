import { inject, Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Drink } from './drink.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrinkService {
  private readonly baseUrl = `${environments.testBaseUrl}/drinks`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAll() {
    const branch = this.authService.getCurrentBranch();
    return this.http.get<Drink[]>(this.baseUrl).pipe(
      map(drinks => drinks.filter(h => h.branch === branch))
    );
  }

  getOne(id: string) {
    return this.http.get<Drink>(`${this.baseUrl}/${id}`);
  }

  update(id: string, formData: FormData) {
    return this.http.patch<Drink>(`${this.baseUrl}/${id}`, formData);
  }

  create(formData: FormData) {
    return this.http.post<Drink>(this.baseUrl, formData);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getImageUrl(imgPath: string): string {
    const filename = imgPath.split('/').pop();
    return `${environments.testBaseUrl}/drinks/file/${filename}`;
  }

}
