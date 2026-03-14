import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
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
        [totalRecords]="totalRecords"
        (onLazyLoad)="loadData($event)"
        [loading]="loading"
      >
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>States</th>
            <th>Created By</th>
            <th>Created Date</th>
          </tr>
        </ng-template>
        <ng-template #body let-machine>
          <tr>
            <td>{{ machine.id }}</td>
            <td>{{ machine.name }}</td>
            <td>{{ machine.description }}</td>
            <td>{{ machine.stateCount }}</td>
            <td>{{ machine.creatorId }}</td>
            <td>{{ machine.creationTime | date: 'short' }}</td>
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
  imports: [ButtonModule, TableModule, DialogModule, InputTextModule, FormsModule, DfaDiagram, DatePipe],
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

  stateMachines: any[] = [];
  totalRecords = 0;

  loading = false;
  loadData(event: TableLazyLoadEvent) {
    this.loading = true;

    const input = {
      maxResultCount: event.rows ?? 5,
      skipCount: event.first ?? 0,
      sorting: event.sortField ? `${event.sortField} ${event.sortOrder === 1 ? 'ASC' : 'DESC'}` : '',
    };

    this.service.getList(input).subscribe({
      next: (data) => {
        this.stateMachines = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  constructor() {}

  showDialog() {
    this.displayDialog = true;
  }

  showStateDialog() {
    this.displayStateDialog = true;
  }

  onSave() {
    if (this.machineName) {
      this.service.addStateMachine(this.machineName, this.machineDescription).subscribe(() => {
        this.displayDialog = false;
        this.machineName = '';
        this.machineDescription = '';
        this.loadData({}); // Refresh list
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
