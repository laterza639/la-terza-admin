import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Schedule } from './schedule.interface';
import { ScheduleService } from './schedule.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/`
    <div class="p-6">
      <!-- Header remains the same -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Horario</h1>
        <button
          *ngIf="!schedule()"
          (click)="openScheduleModal()"
          class="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Configurar Horario
        </button>
      </div>

      <!-- Empty State remains the same -->
      <div *ngIf="!schedule()" class="bg-yellow-400 rounded-lg shadow p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <p class="font-medium text-gray-900">Configura el horario del negocio!</p>
          </div>
        </div>
      </div>

      <!-- Schedule Display -->
      <div *ngIf="schedule()" class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Horario Actual</h2>

            <!-- Morning Schedule -->
            <div class="mb-4" *ngIf="schedule()?.morningOpenTime && schedule()?.morningCloseTime">
              <h3 class="font-medium text-gray-700 mb-2">Horario Mañana</h3>
              <p class="text-gray-600">
                {{ schedule()?.morningOpenTime }} - {{ schedule()?.morningCloseTime }}
              </p>
            </div>

            <!-- Evening Schedule -->
            <div class="mb-4" *ngIf="schedule()?.eveningOpenTime && schedule()?.eveningCloseTime">
              <h3 class="font-medium text-gray-700 mb-2">Horario Tarde</h3>
              <p class="text-gray-600">
                {{ schedule()?.eveningOpenTime }} - {{ schedule()?.eveningCloseTime }}
              </p>
            </div>

            <!-- Status remains the same -->
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full"
                [class.bg-green-500]="schedule()?.isOpen"
                [class.bg-red-500]="!schedule()?.isOpen">
              </span>
              <span class="text-gray-700">
                {{ schedule()?.isOpen ? 'Abierto' : 'Cerrado' }}
              </span>
            </div>
          </div>

          <!-- Actions remain the same -->
          <div class="flex gap-2">
            <button
              (click)="openScheduleModal(schedule())"
              class="p-2 text-gray-600 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              (click)="toggleOpen()"
              class="p-2 rounded-lg transition-colors"
              [class.text-green-600]="!schedule()?.isOpen"
              [class.hover:bg-green-50]="!schedule()?.isOpen"
              [class.text-red-600]="schedule()?.isOpen"
              [class.hover:bg-red-50]="schedule()?.isOpen">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!schedule()?.isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                <path *ngIf="schedule()?.isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export default class ScheduleComponent {
  private scheduleService = inject(ScheduleService);
  private authService = inject(AuthService);
  public schedule = signal<Schedule | null>(null);

  ngOnInit() {
    this.loadSchedule();
  }

  private loadSchedule() {
    this.scheduleService.getByBranch()
      .subscribe(schedule => this.schedule.set(schedule));
  }

  formatTime = (time: string) => {
    // Ensure time is in HH:MM format by removing seconds if present
    return time.split(':').slice(0, 2).join(':');
  };

  openScheduleModal(currentSchedule?: Schedule | null) {
    Swal.fire({
      title: currentSchedule ? 'Editar Horario' : 'Configurar Horario',
      html: /*html*/`
      <form id="scheduleForm" class="space-y-4">
        <!-- Morning Shift Toggle -->
        <div class="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="hasMorningShift"
            class="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            ${(currentSchedule?.morningOpenTime && currentSchedule?.morningCloseTime) ? 'checked' : ''}
          >
          <label for="hasMorningShift" class="text-sm font-medium text-gray-700">
            Incluir horario de mañana
          </label>
        </div>

        <!-- Morning Schedule -->
        <div id="morningFields" class="space-y-2 ${(currentSchedule?.morningOpenTime && currentSchedule?.morningCloseTime) ? '' : 'hidden'}">
          <h3 class="text-left text-sm font-medium text-gray-900">Horario Mañana</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="morningOpenTime" class="block text-start text-sm font-medium text-gray-700">Apertura</label>
              <input
                type="time"
                id="morningOpenTime"
                name="morningOpenTime"
                class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                value="${currentSchedule?.morningOpenTime ? this.formatTime(currentSchedule.morningOpenTime) : '09:00'}"
              >
            </div>
            <div>
              <label for="morningCloseTime" class="block text-start text-sm font-medium text-gray-700">Cierre</label>
              <input
                type="time"
                id="morningCloseTime"
                name="morningCloseTime"
                class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                value="${currentSchedule?.morningCloseTime ? this.formatTime(currentSchedule.morningCloseTime) : '12:00'}"
              >
            </div>
          </div>
        </div>

        <!-- Evening Shift Toggle -->
        <div class="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="hasEveningShift"
            class="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            ${(currentSchedule?.eveningOpenTime && currentSchedule?.eveningCloseTime) ? 'checked' : ''}
          >
          <label for="hasEveningShift" class="text-sm font-medium text-gray-700">
            Incluir horario de tarde
          </label>
        </div>

        <!-- Evening Schedule -->
        <div id="eveningFields" class="space-y-2 ${(currentSchedule?.eveningOpenTime && currentSchedule?.eveningCloseTime) ? '' : 'hidden'}">
          <h3 class="text-left text-sm font-medium text-gray-900">Horario Tarde</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="eveningOpenTime" class="block text-start text-sm font-medium text-gray-700">Apertura</label>
              <input
                type="time"
                id="eveningOpenTime"
                name="eveningOpenTime"
                class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                value="${currentSchedule?.eveningOpenTime ? this.formatTime(currentSchedule.eveningOpenTime) : '18:00'}"
              >
            </div>
            <div>
              <label for="eveningCloseTime" class="block text-start text-sm font-medium text-gray-700">Cierre</label>
              <input
                type="time"
                id="eveningCloseTime"
                name="eveningCloseTime"
                class="w-full p-2 border rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                value="${currentSchedule?.eveningCloseTime ? this.formatTime(currentSchedule.eveningCloseTime) : '21:00'}"
              >
            </div>
          </div>
        </div>
      </form>
    `,
      didOpen: () => {
        // Add event listeners for checkboxes
        const form = document.getElementById('scheduleForm') as HTMLFormElement;
        const morningCheck = form.querySelector('#hasMorningShift') as HTMLInputElement;
        const eveningCheck = form.querySelector('#hasEveningShift') as HTMLInputElement;
        const morningFields = form.querySelector('#morningFields') as HTMLDivElement;
        const eveningFields = form.querySelector('#eveningFields') as HTMLDivElement;

        morningCheck.addEventListener('change', (e) => {
          morningFields.classList.toggle('hidden', !(e.target as HTMLInputElement).checked);
        });

        eveningCheck.addEventListener('change', (e) => {
          eveningFields.classList.toggle('hidden', !(e.target as HTMLInputElement).checked);
        });
      },
      showCancelButton: true,
      confirmButtonText: currentSchedule ? 'Actualizar' : 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        const form = document.getElementById('scheduleForm') as HTMLFormElement;
        const hasMorningShift = (form.querySelector('#hasMorningShift') as HTMLInputElement).checked;
        const hasEveningShift = (form.querySelector('#hasEveningShift') as HTMLInputElement).checked;

        if (!hasMorningShift && !hasEveningShift) {
          Swal.showValidationMessage('Debe seleccionar al menos un horario');
          return false;
        }

        const data: any = {
          branch: this.authService.getCurrentBranch(),
          isOpen: currentSchedule?.isOpen ?? true
        };

        if (hasMorningShift) {
          const morningOpenTime = (form.querySelector('#morningOpenTime') as HTMLInputElement).value;
          const morningCloseTime = (form.querySelector('#morningCloseTime') as HTMLInputElement).value;
          if (!morningOpenTime || !morningCloseTime) {
            Swal.showValidationMessage('Complete todos los campos del horario de mañana');
            return false;
          }
          data.morningOpenTime = this.formatTime(morningOpenTime);
          data.morningCloseTime = this.formatTime(morningCloseTime);
        } else {
          data.morningOpenTime = null;
          data.morningCloseTime = null;
        }

        if (hasEveningShift) {
          const eveningOpenTime = (form.querySelector('#eveningOpenTime') as HTMLInputElement).value;
          const eveningCloseTime = (form.querySelector('#eveningCloseTime') as HTMLInputElement).value;
          if (!eveningOpenTime || !eveningCloseTime) {
            Swal.showValidationMessage('Complete todos los campos del horario de tarde');
            return false;
          }
          data.eveningOpenTime = this.formatTime(eveningOpenTime);
          data.eveningCloseTime = this.formatTime(eveningCloseTime);
        } else {
          data.eveningOpenTime = null;
          data.eveningCloseTime = null;
        }

        return data;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        if (currentSchedule) {
          this.updateSchedule(currentSchedule.id, result.value);
        } else {
          this.createSchedule(result.value);
        }
      }
    });
  }

  createSchedule(data: Omit<Schedule, 'id'>) {
    this.scheduleService.create(data).subscribe({
      next: () => {
        this.loadSchedule();
        Swal.fire({
          title: '¡Éxito!',
          text: "Horario configurado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo configurar el horario', 'error')
    });
  }

  updateSchedule(id: string, data: Partial<Schedule>) {
    this.scheduleService.update(id, data).subscribe({
      next: () => {
        this.loadSchedule();
        Swal.fire({
          title: '¡Éxito!',
          text: "Horario actualizado correctamente",
          icon: 'success',
          confirmButtonColor: '#EAB308'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el horario', 'error')
    });
  }

  toggleOpen() {
    const currentSchedule = this.schedule();
    if (!currentSchedule) return;

    this.updateSchedule(currentSchedule.id, {
      isOpen: !currentSchedule.isOpen
    });
  }
}
