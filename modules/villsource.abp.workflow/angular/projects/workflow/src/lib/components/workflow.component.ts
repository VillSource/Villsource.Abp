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
  styles: [
    `
      .workflow-wrapper {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 100px); /* Adjust based on common header height if any */
        width: 100%;
        overflow: hidden;
      }
      .diagram-panel {
        height: 40%;
        border-bottom: 2px solid #e2e8f0;
        background: #f8fafc;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        box-sizing: border-box;
      }
      .list-panel {
        height: 60%;
        overflow-y: auto;
        padding: 1rem;
        box-sizing: border-box;
      }
      .list-panel.full-height {
        height: 100%;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .diagram-container {
        flex: 1;
        min-height: 0;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        overflow: hidden;
        background: white;
      }
    `,
  ],
  template: `
    <div class="workflow-wrapper">
      @if (diagramVisible) {
        <div class="diagram-panel">
          <div class="section-header">
            <h3 style="margin: 0;">
              Currently editing: {{ selectedMachine?.name }}
              @if (selectedNodeInfo(); as node) {
                <span style="color: #64748b; font-weight: 400;"> > {{ node.name }} ({{ node.id }})</span>
              }
            </h3>
            <div>
              <p-button
                label="Close Diagram"
                severity="secondary"
                icon="pi pi-times"
                [text]="true"
                (click)="diagramVisible = false; selectedNodeInfo.set(null)"
              ></p-button>
              <p-button
                label="Add State"
                icon="pi pi-plus"
                (click)="showStateDialog()"
                style="margin-left: 0.5rem;"
              ></p-button>
            </div>
          </div>
          <div class="diagram-container">
            <lib-dfa-diagram
              id="state-machine-diagram"
              style="height: 100%; width: 100%; display: block;"
              [stateInput]="addStateEvent()"
              [initialStates]="selectedStates()"
              (nodeSelected)="selectedNodeInfo.set($event)"
            ></lib-dfa-diagram>
          </div>
        </div>
      }

      <div class="list-panel" [class.full-height]="!diagramVisible">
        <div class="section-header">
          <h2 style="margin: 0;">State Machines</h2>
          <p-button label="New State Machine" icon="pi pi-plus" (click)="showDialog()"></p-button>
        </div>

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
      </div>
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
  selectedNodeInfo = signal<{ id: string; name: string; description: string } | null>(null);

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
    this.selectedNodeInfo.set(null);
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
