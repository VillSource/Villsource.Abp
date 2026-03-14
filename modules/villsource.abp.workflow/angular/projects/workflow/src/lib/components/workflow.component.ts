import { Component, inject, signal } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DfaDiagram } from '../dfa-diagram/dfa-diagram';

@Component({
  selector: 'lib-workflow',
  template: `
    <lib-dfa-diagram class="h-1/2" [stateInput]="addStateEvent()"></lib-dfa-diagram>

    <p-button label="Add State Machine" (click)="showDialog()"></p-button>
    <p-button label="Add State" (click)="showStateDialog()"></p-button>
    <p-button label="Add mock State" (click)="addNode()"></p-button>

    <div class="card" style="margin-top: 1rem;">
      <p-table
        [value]="stateMachines"
        [lazy]="true"
        [tableStyle]="{ 'min-width': '50rem' }"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
        [totalRecords]="1000"
        (onLazyLoad)="loadData($event)"
        [loading]="loading"
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

    <p-dialog
      header="Add State"
      [(visible)]="displayStateDialog"
      [modal]="true"
      [style]="{ width: '25rem' }"
    >
      <div
        style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; margin-bottom: 1rem;"
      >
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="name" style="font-weight: 600;">Name</label>
          <input pInputText id="name" [(ngModel)]="stateName" autocomplete="off" />
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="description" style="font-weight: 600;">Description</label>
          <input pInputText id="description" [(ngModel)]="stateDescription" autocomplete="off" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          severity="secondary"
          [text]="true"
          (click)="displayStateDialog = false"
        ></p-button>
        <p-button label="Save" (click)="onStateSave()"></p-button>
      </ng-template>
    </p-dialog>
  `,
  standalone: true,
  imports: [ButtonModule, TableModule, DialogModule, InputTextModule, FormsModule, DfaDiagram],
})
export class WorkflowComponent {
  protected readonly service = inject(WorkflowService);

  addStateEvent = signal<{ name: string; description: string } | null>(null);

  displayDialog = false;
  machineName = '';
  machineDescription = '';

  displayStateDialog = false;
  stateName = '';
  stateDescription = '';

  stateMachines = [
    { name: 'Approval Workflow', description: 'Basic document approval' },
    { name: 'Onboarding', description: 'Employee onboarding process' },
    { name: 'Purchase Order', description: 'PO request and approval' },
    { name: 'Leave Request', description: 'Employee leave management' },
    { name: 'Expense Claim', description: 'Expense reimbursement process' },
    { name: 'IT Support', description: 'Ticket resolution workflow' },
  ];

  loading = false;
  loadData(event: TableLazyLoadEvent) {
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? 10);

    this.stateMachines = [];
    for (let i = 0; i <= (event.rows ?? 10); i++) {
      this.stateMachines.push({
        name: `Machine ${page * (event.rows ?? 10) + i}`,
        description: `Description ${page * (event.rows ?? 10) + i}`,
      });
    }
    this.loading = false;
  }

  constructor() {}

  showDialog() {
    this.displayDialog = true;
  }

  showStateDialog() {
    this.displayStateDialog = true;
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

  onStateSave() {
    const state = {
      name: this.stateName,
      description: this.stateDescription,
    };

    if (this.stateName) {
      this.service.addState(state.name, state.description).subscribe(() => {
        this.displayStateDialog = false;
        this.stateName = '';
        this.stateDescription = '';

        this.addStateEvent.set({
          name: state.name,
          description: state.description,
        });
      });
    }
  }

  addNode() {
    console.log('addNode');
    this.addStateEvent.set({
      name: `mock state ${Date.now()}`,
      description: `mock description ${Date.now()}`,
    });
  }
}
