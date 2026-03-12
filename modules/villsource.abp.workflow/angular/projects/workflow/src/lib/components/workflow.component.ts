import { Component, inject } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-workflow',
  template: `
    <p-button label="Add State Machine" (click)="showDialog()"></p-button>
    <div class="card" style="margin-top: 1rem;">
      <p-table
        [value]="stateMachines"
        [tableStyle]="{ 'min-width': '50rem' }"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
      >
        <ng-template #header>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </ng-template>
        <ng-template #body let-machine>
          <tr>
            <td>{{ machine.name }}</td>
            <td>{{ machine.description }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog
      header="Add State Machine"
      [(visible)]="displayDialog"
      [modal]="true"
      [style]="{ width: '25rem' }"
    >
      <div
        style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; margin-bottom: 1rem;"
      >
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="name" style="font-weight: 600;">Name</label>
          <input pInputText id="name" [(ngModel)]="machineName" autocomplete="off" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="description" style="font-weight: 600;">Description</label>
          <input pInputText id="description" [(ngModel)]="machineDescription" autocomplete="off" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          severity="secondary"
          [text]="true"
          (click)="displayDialog = false"
        ></p-button>
        <p-button label="Save" (click)="onSave()"></p-button>
      </ng-template>
    </p-dialog>
  `,
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, InputTextModule, FormsModule],
})
export class WorkflowComponent {
  protected readonly service = inject(WorkflowService);

  displayDialog = false;
  machineName = '';
  machineDescription = '';

  stateMachines = [
    { name: 'Approval Workflow', description: 'Basic document approval' },
    { name: 'Onboarding', description: 'Employee onboarding process' },
    { name: 'Purchase Order', description: 'PO request and approval' },
    { name: 'Leave Request', description: 'Employee leave management' },
    { name: 'Expense Claim', description: 'Expense reimbursement process' },
    { name: 'IT Support', description: 'Ticket resolution workflow' },
  ];

  constructor() {
    // this.service.addStateMachine('Test', 'Test').subscribe(console.log);
  }

  showDialog() {
    this.displayDialog = true;
  }

  onSave() {
    const machine = {
      name: this.machineName,
      description: this.machineDescription,
    };
    if (this.machineName) {
      this.service.addStateMachine(machine.name, machine.description).subscribe(() => {
        this.stateMachines = [...this.stateMachines, machine];
        this.displayDialog = false;
        this.machineName = '';
        this.machineDescription = '';
      });
    }
  }
}
