import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from './user.interface';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/`
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button
          (click)="openCreateModal()"
          class="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Agregar Usuario
        </button>
      </div>

      <div *ngIf="users().length === 0" class="bg-yellow-400 rounded-lg shadow p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <p class="font-medium text-gray-900">No hay usuarios registrados</p>
          </div>
        </div>
      </div>

      <!-- User List -->
      <div class="grid gap-4">
        @for (user of users(); track user.id) {
          <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div>
                <h3 class="font-medium text-gray-900">{{ user.email }}</h3>
                <p class="text-sm text-gray-500">Sucursal: {{ user.branch === '1' ? 'Casa Matriz' : 'Suc-1' }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                (click)="openEditModal(user)"
                class="p-2 text-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                (click)="openDeleteModal(user.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export default class UserComponent {
  private userService = inject(UserService);
  public users = signal<User[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getAll()
      .subscribe(users => this.users.set(users));
  }

  openCreateModal() {
    Swal.fire({
      title: 'Nuevo Usuario',
      html: /*html*/`
        <form id="userForm" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="block text-start text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              required
            >
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-start text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              required
            >
          </div>

          <div class="space-y-2">
            <label for="branch" class="block text-start text-sm font-medium text-gray-700">Sucursal</label>
            <select 
              id="branch" 
              name="branch"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              required
            >
              <option value="1">Casa Matriz</option>
              <option value="2">Suc-1</option>
            </select>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('userForm') as HTMLFormElement;

        const email = (form.querySelector('#email') as HTMLInputElement).value;
        const password = (form.querySelector('#password') as HTMLInputElement).value;
        const branch = (form.querySelector('#branch') as HTMLSelectElement).value;

        if (!email || !email.includes('@')) {
          Swal.showValidationMessage('Email inválido');
          return false;
        }
        if (password.length < 6) {
          Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
          return false;
        }

        return { email, password, branch };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.createUserConfirmation(result.value);
      }
    });
  }

  openEditModal(user: User) {
    Swal.fire({
      title: 'Editar Usuario',
      html: /*html*/`
        <form id="userForm" class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="block text-start text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${user.email}"
              required
              disabled
            >
          </div>

          <div class="space-y-2">
            <label for="branch" class="block text-start text-sm font-medium text-gray-700">Sucursal</label>
            <select 
              id="branch" 
              name="branch"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              required
            >
              <option value="1" ${user.branch === '1' ? 'selected' : ''}>Casa Matriz</option>
              <option value="2" ${user.branch === '2' ? 'selected' : ''}>Suc-1</option>
            </select>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('userForm') as HTMLFormElement;
        const branch = (form.querySelector('#branch') as HTMLSelectElement).value;
        return { branch };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateUserConfirmation(user.id, result.value);
      }
    });
  }

  openDeleteModal(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire({
              title: '¡Eliminado!',
              text: "El usuario ha sido eliminado",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#EAB308'
            })
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
        });
      }
    });
  }

  createUserConfirmation(userData: { email: string; password: string; branch: string }) {
    this.userService.create(userData).subscribe({
      next: () => {
        this.loadUsers();
        Swal.fire({
          title: '¡Éxito!',
          text: "Usuario creado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo crear el usuario', 'error')
    });
  }

  updateUserConfirmation(id: string, userData: { branch: string }) {
    this.userService.update(id, userData).subscribe({
      next: () => {
        this.loadUsers();
        Swal.fire({
          title: '¡Éxito!',
          text: "Usuario actualizado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
    });
  }
}