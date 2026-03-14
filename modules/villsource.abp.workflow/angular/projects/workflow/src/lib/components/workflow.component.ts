import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkflowService, StateMachineListDto } from '../services/workflow.service';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DfaDiagram } from '../dfa-diagram/dfa-diagram';

@Component({
  selector: 'lib-workflow',
  template: `
    @if (diagramVisible) {
      <div style="margin-bottom: 1rem;">
        <h3>Currently editing: {{ selectedMachine?.name }}</h3>
        <p-button
          label="Close Diagram"
          severity="secondary"
          (click)="diagramVisible = false"
        ></p-button>
        <p-button
          label="Add State"
          (click)="showStateDialog()"
          style="margin-left: 0.5rem;"
        ></p-button>
      </div>
      <lib-dfa-diagram
        id="state-machine-diagram"
        class="h-1/2"
        [stateInput]="addStateEvent()"
        [initialStates]="selectedStates()"
      ></lib-dfa-diagram>
    }

    <div style="margin-top: 1rem; margin-bottom: 1rem;">
      <p-button label="Add State Machine" (click)="showDialog()"></p-button>
    </div>

    <div class="card">
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
            <th>Actions</th>
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
            <td>
              <p-button
                icon="pi pi-external-link"
                label="Show Diagram"
                [text]="true"
                (click)="showDiagram(machine)"
              ></p-button>
            </td>
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
  imports: [
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    DfaDiagram,
    DatePipe,
  ],
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

  diagramVisible = false;
  selectedMachine: StateMachineListDto | null = null;
  selectedStates = signal<any[]>([]);

  loading = false;
  loadData(event: TableLazyLoadEvent) {
    this.loading = true;

    const input = {
      maxResultCount: event.rows ?? 5,
      skipCount: event.first ?? 0,
      sorting: event.sortField
        ? `${event.sortField} ${event.sortOrder === 1 ? 'ASC' : 'DESC'}`
        : '',
    };

    this.service.getList(input).subscribe({
      next: data => {
        this.stateMachines = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  showDialog() {
    this.displayDialog = true;
  }

  showStateDialog() {
    this.displayStateDialog = true;
  }

  showDiagram(machine: StateMachineListDto) {
    this.diagramVisible = true;
    this.selectedMachine = machine;
    this.selectedStates.set([]);
    this.service.getStates(machine.id).subscribe(states => {
      this.selectedStates.set(states);
    });
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
    if (this.stateName && this.selectedMachine) {
      this.service
        .addState(this.stateName, this.stateDescription, this.selectedMachine.id)
        .subscribe(() => {
          this.displayStateDialog = false;
          const newState = {
            name: this.stateName,
            description: this.stateDescription,
          };
          this.stateName = '';
          this.stateDescription = '';

          this.addStateEvent.set(newState);
          this.selectedMachine!.stateCount++; // Optimistic update
        });
    }
  }
}
