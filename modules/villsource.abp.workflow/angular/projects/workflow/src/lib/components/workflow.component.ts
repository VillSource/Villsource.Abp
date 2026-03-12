import { Component, inject } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'lib-workflow',
  template: ` <p-button label="Submit"></p-button>
    <div class="card">
      <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
          </tr>
        </ng-template>
        <ng-template #body let-product>
          <tr>
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.quantity }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>`,
  standalone: true,
  imports: [ButtonModule, TableModule],
})
export class WorkflowComponent {
  protected readonly service = inject(WorkflowService);

  products = [
    { code: '1', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: '2', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: '3', name: 'Product 3', category: 'Category 3', quantity: 30 },
    { code: '4', name: 'Product 4', category: 'Category 4', quantity: 40 },
    { code: '5', name: 'Product 5', category: 'Category 5', quantity: 50 },
  ];

  constructor() {
    this.service.sample().subscribe(console.log);
  }
}
