import { Component, inject } from '@angular/core';
import { AuthService, LocalizationPipe } from '@abp/ng.core';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [LocalizationPipe, ButtonModule, TableModule, AccordionModule],
  standalone: true,
})
export class HomeComponent {
  private authService = inject(AuthService);

  products = [
    { code: '1', name: 'Product 1', category: 'Category 1', quantity: 1 },
    { code: '2', name: 'Product 2', category: 'Category 2', quantity: 2 },
    { code: '3', name: 'Product 3', category: 'Category 3', quantity: 3 },
    { code: '4', name: 'Product 4', category: 'Category 4', quantity: 4 },
    { code: '5', name: 'Product 5', category: 'Category 5', quantity: 5 },
  ];

  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  login() {
    this.authService.navigateToLogin();
  }
}
