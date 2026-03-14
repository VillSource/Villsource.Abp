import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WorkflowService, StateMachineListDto } from '../services/workflow.service';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DfaDiagram } from '../dfa-diagram/dfa-diagram';
import { PropertiesComponent } from './properties.component';
import { provideNgDiagram } from 'ng-diagram';

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
              <!-- @if (selectedNodeInfo(); as node) {
                <span style="color: #64748b; font-weight: 400;">
                  > {{ node.name }} ({{ node.id }})</span
                >
              }
              @if (selectedEdgeInfo(); as edge) {
                <span style="color: #64748b; font-weight: 400;">
                  > Transition: {{ edge.label || 'unlabeled' }}</span
                >
              } -->
            </h3>
            <div>
              <p-button
                label="Close Diagram"
                severity="secondary"
                icon="pi pi-times"
                [text]="true"
                (click)="
                  diagramVisible = false; selectedNodeInfo.set(null); selectedEdgeInfo.set(null)
                "
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
              [initialStates]="selectedStates()"
              (nodeSelected)="selectedNodeInfo.set($event)"
              (edgeSelected)="selectedEdgeInfo.set($event)"
              (nodePositionChanged)="updateNodePosition($event)"
            ></lib-dfa-diagram>
          </div>
        </div>
      }

      <div class="list-panel" [class.full-height]="!diagramVisible">
        <lib-workflow-properties
          [syncing]="positionSyncing()"
          (saved)="refreshStates()"
        ></lib-workflow-properties>

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
    PropertiesComponent,
    DatePipe,
  ],
  providers: [provideNgDiagram()],
})
export class WorkflowComponent {
  protected readonly service = inject(WorkflowService);

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
  selectedEdgeInfo = signal<{ id: string; label: string } | null>(null);
  positionSyncing = signal(false);

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
    this.selectedEdgeInfo.set(null);
    this.service.getStates(machine.id).subscribe(states => {
      this.selectedStates.set(states);
    });
  }

  refreshStates() {
    if (this.selectedMachine) {
      this.service.getStates(this.selectedMachine.id).subscribe(states => {
        this.selectedStates.set(states);
      });
    }
  }

  updateNodePosition(event: { id: string; x: number; y: number }) {
    // Optimistically update the local state positions so that
    // next operations (like adding a state) use the correct coordinates.
    const currentStates = this.selectedStates();
    const updatedStates = currentStates.map(s =>
      s.id === event.id ? { ...s, positionX: event.x, positionY: event.y } : s,
    );
    this.selectedStates.set(updatedStates);

    this.positionSyncing.set(true);
    this.service.updateStatePosition(event.id, event.x, event.y).subscribe({
      next: res => {
        // Update the concurrency stamp returned by the server
        const states = this.selectedStates();
        const syncedStates = states.map(s =>
          s.id === event.id ? { ...s, concurrencyStamp: res.concurrencyStamp } : s,
        );
        this.selectedStates.set(syncedStates);
        this.positionSyncing.set(false);
      },
      error: () => {
        this.positionSyncing.set(false);
      },
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
      // Calculate a default position for the new node (e.g., at the end)
      const states = this.selectedStates();
      const lastState = states.length > 0 ? states[states.length - 1] : null;
      const x = lastState ? (lastState.positionX ?? 0) + 250 : 0;
      const y = lastState ? (lastState.positionY ?? 0) : 0;

      this.service
        .addState(this.stateName, this.stateDescription, this.selectedMachine.id, x, y)
        .subscribe(res => {
          this.displayStateDialog = false;
          const newState = {
            id: res.id,
            name: res.name,
            description: res.description,
            positionX: res.positionX,
            positionY: res.positionY,
            concurrencyStamp: res.concurrencyStamp,
          };
          this.stateName = '';
          this.stateDescription = '';

          this.selectedStates.set([...states, newState]);
          this.selectedMachine!.stateCount++; // Optimistic update
        });
    }
  }
}
