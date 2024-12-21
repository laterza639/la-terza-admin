import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
    `
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 sm:space-y-8">
      <!-- Logo and Title -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="bg-gray-800 rounded-full p-3 sm:p-4">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </div>
        </div>
        <h2 class="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
          La Terza Admin
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <!-- Login Form -->
      <form [formGroup]="myForm" (ngSubmit)="login()" class="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
        <div class="space-y-4">
          <!-- Email Input -->
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              formControlName="email"
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 text-base sm:text-sm"
              placeholder="Email"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              formControlName="password"
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 text-base sm:text-sm"
              placeholder="Contraseña"
            />
          </div>

          <!-- Branch Select -->
          <div class="relative">
            <select
              formControlName="branch"
              id="branch"
              name="branch"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 sm:py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 text-base sm:text-sm pr-10"
            >
              <option value="" disabled selected>Selecciona una sucursal</option>
              <option value="1">Casa Matriz</option>
              <option value="2">Suc-1</option>
            </select>
            <!-- Custom arrow -->
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            [disabled]="myForm.invalid"
            class="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent text-base sm:text-sm font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
})
export default class AuthComponent {
  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['luis@gmail.com', [Validators.required]],
    password: ['Abc123', [Validators.required]],
    branch: ['', [Validators.required]]
  })

  login() {
    const { email, password, branch } = this.myForm.value;

    this.authenticationService.login(email, password, branch)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/admin')
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Bienvenido!",
            showConfirmButton: false,
            timer: 1000
          });
        },
        error: (errorMessage) => {
          Swal.fire('Error', errorMessage, 'error')
        }
      })
  }
}
