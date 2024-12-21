import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Snack } from './snack.interface';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SnackService } from './snack.service';

@Component({
  selector: 'app-snack',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
    `
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Piqueos</h1>
      <button
        (click)="openCreateModal()"
        class="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        Agregar
      </button>
    </div>

    <div *ngIf="snacks().length === 0" class="bg-yellow-400 rounded-lg shadow p-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div>
          <p class="font-medium text-gray-900">Agrega piqueos a la lista!</p>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="grid gap-4">
      @for (snack of snacks(); track snack.id) {
        <div class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div>
              <h3 class="font-medium text-gray-900">{{ snack.name }}</h3>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              (click)="openEditModal(snack)"
              class="p-2 text-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              (click)="openDeleteModal(snack.id)"
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
export default class SnackComponent {
  private snackService = inject(SnackService);
  private authService = inject(AuthService);
  public snacks = signal<Snack[]>([]);

  ngOnInit() {
    this.loadSnacks();
  }

  private loadSnacks() {
    this.snackService.getAll()
      .subscribe(snacks => this.snacks.set(snacks));
  }

  openCreateModal(snack?: Snack) {
    Swal.fire({
      title: 'Nueva Bebida',
      html: /*html*/`
        <form id="snackForm" class="space-y-4">

          <div class="space-y-2">
            <label for="name" class="block text-start text-sm font-medium text-gray-700">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
              value="${snack?.name || ''}"
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
              value="${snack?.price || ''}"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="img" class="block text-start text-sm font-medium text-gray-700">Imagen</label>
            <input 
              type="file" 
              id="img" 
              name="img"
              accept="image/*"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
            >
          </div>

        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('snackForm') as HTMLFormElement;
        const formData = new FormData();

        // Get form field values
        const name = (form.querySelector('#name') as HTMLInputElement).value;
        const price = (form.querySelector('#price') as HTMLInputElement).value;
        const fileInput = form.querySelector('#img') as HTMLInputElement;

        // Append all form fields
        if (name.length >= 3) formData.append('name', name);
        if (price) formData.append('price', Number(price).toFixed(2));

        // Get branch from auth service
        const branch = this.authService.getCurrentBranch();
        formData.append('branch', branch);

        // Only append file if one is selected
        if (fileInput.files && fileInput.files.length > 0) {
          formData.append('img', fileInput.files[0]);
        }

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
        if (snack) {
          this.updateSnackConfirmation(snack.id, result.value);
        } else {
          this.createSnackConfirmation(result.value);
        }
      }
    });
  }

  openEditModal(snack: Snack) {
    const imageUrl = snack.img
      ? this.snackService.getImageUrl(snack.img)
      : '';

    Swal.fire({
      title: 'Editar Bebida',
      html: /*html*/`
        <form id="snackForm" class="space-y-4">

          <div class="space-y flex justify-center">
            <label class="flex items-center justify-center flex-col">
              <span class="ml-2 text-sm font-medium text-gray-700 mb-2">Disponible</span>
              <input
                type="checkbox"
                id="available"
                name="available"
                class="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                ${snack?.available ? 'checked' : ''}
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
              value="${snack.name}"
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
              value="${snack.price}"
              required
            >
          </div>

          <div class="space-y-2">
            <label for="img" class="block text-sm text-start font-medium text-gray-700">Imagen</label>
            ${snack.img ? `
              <div class="flex justify-center mb-4">
                <img src="${imageUrl}" alt="Preview" class="w-32 h-32 object-cover rounded-lg shadow">
              </div>
            ` : ''}
            <input 
              type="file" 
              id="img" 
              name="img"
              accept="image/*"
              class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500" 
            >
          </div>

        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('snackForm') as HTMLFormElement;
        const formData = new FormData(form);
        const available = (form.querySelector('#available') as HTMLInputElement).checked;

        // Get branch from auth service
        const branch = this.authService.getCurrentBranch();
        formData.append('branch', branch);
        formData.append('available', available.toString())

        // Check if file input has a file
        const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
          formData.delete('img');
        }

        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateSnackConfirmation(snack.id, result.value);
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
        this.snackService.delete(id).subscribe({
          next: () => {
            this.loadSnacks();
            Swal.fire({
              title: '¡Eliminado!',
              text: "El piqueo ha sido eliminada",
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#EAB308'
            })
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el bebida', 'error')
        });
      }
    });
  }

  createSnackConfirmation(formData: FormData) {
    this.snackService.create(formData).subscribe({
      next: () => {
        this.loadSnacks();
        Swal.fire({
          title: '¡Éxito!',
          text: "Piqueo creada correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo agregar el piqueo', 'error')
    });
  }

  updateSnackConfirmation(id: string, formData: FormData) {
    this.snackService.update(id, formData).subscribe({
      next: () => {
        this.loadSnacks();
        Swal.fire({
          title: '¡Éxito!',
          text: "Piqueo actualizada correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el piqueo', 'error')
    });
  }
}
