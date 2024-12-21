import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Extra } from './extra.interface';
import { AuthService } from '../auth/auth.service';
import { ExtraService } from './extra.service';

@Component({
  selector: 'app-extra',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
    `
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Extras</h1>
      <button
        (click)="openCreateModal()"
        class="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Agregar
      </button>
    </div>

    <div *ngIf="extras().length === 0" class="bg-yellow-400 rounded-lg shadow p-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div>
          <p class="font-medium text-gray-900">Agrega extras a la lista!</p>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="grid gap-4">
      @for (extra of extras(); track extra.id) {
        <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div>
              <h3 class="font-medium text-gray-900">{{ extra.name }}</h3>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="openEditModal(extra)"
              class="p-2 text-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              (click)="openDeleteModal(extra.id)"
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
export default class ExtraComponent implements OnInit {
  private extraService = inject(ExtraService);
  private authService = inject(AuthService);
  public extras = signal<Extra[]>([]);

  ngOnInit() {
    this.loadExtras();
  }

  private loadExtras() {
    this.extraService.getAll()
      .subscribe(extras => this.extras.set(extras));
  }

  openCreateModal(extra?: Extra) {
    Swal.fire({
      title: 'Nuevo Extra',
      html: /*html*/`
        <form id="extraForm" class="space-y-4">

          <div class="space-y-2">
            <label for="name" class="block text-start text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${extra?.name || ''}"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="price" class="block text-start text-sm font-medium text-gray-700">Precio</label>
            <input 
              type="number" 
              id="price" 
              name="price"
              step="0.01"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${extra?.price || ''}"
              required
            >
          </div>

        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('extraForm') as HTMLFormElement;
        const formData = new FormData();

        // Get form field values
        const name = (form.querySelector('#name') as HTMLInputElement).value;
        const price = (form.querySelector('#price') as HTMLInputElement).value;

        // Append all form fields
        if (name.length >= 3) formData.append('name', name);
        if (price) formData.append('price', Number(price).toFixed(2));

        // Get branch from auth service
        const branch = this.authService.getCurrentBranch();
        formData.append('branch', branch);

        // Add available as true by default
        formData.append('available', 'true');

        // Validate
        if (name.length < 3) {
          Swal.showValidationMessage('El nombre debe tener al menos 3 caracteres');
          return false;
        }
        if (!price) {
          Swal.showValidationMessage('El precio es requerido');
          return false;
        }

        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        if (extra) {
          this.updateExtraConfirmation(extra.id, result.value);
        } else {
          this.createExtraConfirmation(result.value);
        }
      }
    });
  }

  openEditModal(extra: Extra) {

    Swal.fire({
      title: 'Editar Extra',
      html: /*html*/`
        <form id="extraForm" class="space-y-4">

          <div class="space-y flex justify-center">
            <label class="flex items-center justify-center flex-col">
              <span class="ml-2 text-sm font-medium text-gray-700 mb-2">Disponible</span>
              <input
                type="checkbox"
                id="available"
                name="available"
                class="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                ${extra?.available ? 'checked' : ''}
              >
            </label>
          </div>

          <div class="space-y-2">
            <label for="name" class="block text-start text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${extra.name}"
              required
            >
          </div>
        
          <div class="space-y-2">
            <label for="price" class="block text-start text-sm font-medium text-gray-700">Precio</label>
            <input 
              type="number" 
              id="price" 
              name="price"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${extra.price}"
              required
            >
          </div>

        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('extraForm') as HTMLFormElement;
        const formData = new FormData();
        const available = (form.querySelector('#available') as HTMLInputElement).checked;
        const name = (form.querySelector('#name') as HTMLInputElement).value;
        const price = (form.querySelector('#price') as HTMLInputElement).value;

        // Validate and append
        if (name.length >= 3) formData.append('name', name);
        if (price) formData.append('price', Number(price).toFixed(2));

        // Get branch from auth service
        const branch = this.authService.getCurrentBranch();
        formData.append('branch', branch);
        formData.append('available', available.toString());

        // Validation
        if (name.length < 3) {
          Swal.showValidationMessage('El nombre debe tener al menos 3 caracteres');
          return false;
        }
        if (!price) {
          Swal.showValidationMessage('El precio es requerido');
          return false;
        }

        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateExtraConfirmation(extra.id, result.value);
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
        this.extraService.delete(id).subscribe({
          next: () => {
            this.loadExtras();
            Swal.fire({
              title: '¡Eliminado!',
              text: "El extra ha sido eliminado",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#EAB308'
            })
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el extra', 'error')
        });
      }
    });
  }

  createExtraConfirmation(formData: FormData) {
    this.extraService.create(formData).subscribe({
      next: () => {
        this.loadExtras();
        Swal.fire({
          title: '¡Éxito!',
          text: "Extra creado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo agregar el extra', 'error')
    });
  }

  updateExtraConfirmation(id: string, formData: FormData) {
    this.extraService.update(id, formData).subscribe({
      next: () => {
        this.loadExtras();
        Swal.fire({
          title: '¡Éxito!',
          text: "Extra actualizado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el extra', 'error')
    });
  }
}
