import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  template: /*html*/`
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside [class]="sidebarOpen ? 'translate-x-0' : '-translate-x-64'" class="fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out bg-gray-800">
      <!-- Logo section -->
      <div class="flex items-center justify-between h-16 px-4 bg-gray-900">
        <div class="flex items-center">
          <img src="logo.png" alt="Logo" class="w-8 h-8">
          <span class="ml-2 text-xl font-semibold text-white">La Terza</span>
        </div>
        <button (click)="toggleSidebar()" class="p-2 rounded-md lg:hidden hover:bg-gray-700">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="px-4 mt-6">
        <a routerLink="hamburguer" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Hamburguesas
        </a>

        <a routerLink="drink" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Bebidas
        </a>

        <a routerLink="snack" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Piqueos
        </a>

        <a routerLink="dessert" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Postres
        </a>

        <a routerLink="extra" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Extras
        </a>

        <a routerLink="horario" routerLinkActive="bg-gray-700" class="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Horarios
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div [class]="sidebarOpen ? 'ml-64' : 'ml-0'" class="transition-margin duration-300 ease-in-out">
      <!-- Top Navigation -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center space-x-4">
            <button (click)="toggleSidebar()" class="p-2 rounded-md hover:bg-gray-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <!-- Branch Display -->
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span class="font-medium text-gray-700">{{ branchName() }}</span>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button (click)="toggleUserMenu()" class="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div *ngIf="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <!-- Only show if super-admin -->
              <a *ngIf="isSuperAdmin"
                 routerLink="user"
                 (click)="handleMenuItemClick()"
                 class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Administrar usuarios
              </a>
              <button (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  sidebarOpen = false;
  userMenuOpen = false;
  branchMenuOpen = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  // Compute the branch name based on the currentUser signal
  branchName = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '';
    return user.branch === '1' ? 'Casa Matriz' : 'Suc-1';
  });

  get isSuperAdmin(): boolean {
    return this.authService.getCurrentRole().includes('super-admin');
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.branchMenuOpen = false;
  }

  toggleBranchMenu() {
    this.branchMenuOpen = !this.branchMenuOpen;
    this.userMenuOpen = false;
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  handleMenuItemClick() {
    this.userMenuOpen = false;
  }
}