import { Component, computed, inject, signal, output, effect, untracked, input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgDiagramModelService, NgDiagramSelectionService } from 'ng-diagram';
import { WorkflowService } from '../services/workflow.service';

@Component({
  selector: 'lib-workflow-properties',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CardModule,
    FloatLabelModule,
    DividerModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    <p-card *ngIf="selectedNode() || selectedEdge()" styleClass="properties-card">
      <ng-template pTemplate="header">
        <div class="properties-header">
          <i class="pi pi-cog pi-spin-slow"></i>
          <span>Element Properties</span>
        </div>
      </ng-template>

      <div class="properties-grid">
        <!-- Node Properties -->
        <div *ngIf="selectedNode() as node" class="property-section">
          <div class="section-title">
            <i class="pi pi-box"></i>
            <span>STATE CONFIGURATION</span>
          </div>

          <div class="fields-container">
            <p-floatLabel variant="on">
              <input
                pInputText
                id="node-id"
                [ngModel]="nodeId()"
                [disabled]="true"
              />
              <label for="node-id">State ID (Read-only)</label>
            </p-floatLabel>

            <p-floatLabel variant="on">
              <input
                pInputText
                id="node-name"
                [(ngModel)]="editName"
                (ngModelChange)="onNameChange($event)"
              />
              <label for="node-name">State Name</label>
            </p-floatLabel>

            <p-floatLabel variant="on">
              <textarea
                pInputTextarea
                id="node-desc"
                [(ngModel)]="editDescription"
                (ngModelChange)="onDescriptionChange($event)"
                rows="3"
              ></textarea>
              <label for="node-desc">Description</label>
            </p-floatLabel>

            <div class="save-actions">
              <span *ngIf="syncing()" class="sync-indicator">
                <i class="pi pi-spin pi-spinner"></i> Syncing position...
              </span>
              <p-button 
                label="Delete State" 
                icon="pi pi-trash" 
                severity="danger"
                [outlined]="true"
                [disabled]="syncing() || deleting()"
                [loading]="deleting()"
                (click)="confirmDelete()"
              ></p-button>
              <p-button 
                label="Save Changes" 
                icon="pi pi-save" 
                severity="success"
                [loading]="saving()"
                [disabled]="syncing()"
                (click)="saveNode()"
              ></p-button>
            </div>
          </div>
        </div>

        <p-divider layout="vertical" *ngIf="selectedNode() && selectedEdge()"></p-divider>

        <!-- Edge Properties -->
        <div *ngIf="selectedEdge() as edge" class="property-section">
          <div class="section-title">
            <i class="pi pi-share-alt"></i>
            <span>TRANSITION CONFIGURATION</span>
          </div>

          <div class="fields-container">
            <p-floatLabel variant="on">
              <input
                pInputText
                id="edge-label"
                [ngModel]="edgeLabel()"
                (ngModelChange)="updateEdgeLabel($event)"
              />
              <label for="edge-label">Transition Label</label>
            </p-floatLabel>
          </div>
        </div>
      </div>
    </p-card>
  `,
  styles: [
    `
      :host ::ng-deep .properties-card {
        margin-top: 1rem;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .properties-header {
        padding: 1rem 1.5rem;
        background: linear-gradient(to right, #f8fafc, #ffffff);
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 700;
        color: #1e293b;
        font-size: 1.1rem;
      }
      .pi-spin-slow {
        animation: fa-spin 5s infinite linear;
      }
      .properties-grid {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        padding: 0.5rem 0;
      }
      .property-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        font-weight: 800;
        color: #64748b;
        letter-spacing: 0.1em;
      }
      .fields-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding-top: 0.5rem;
      }
      input[pInputText],
      textarea[pInputTextarea] {
        width: 100%;
      }
      textarea[pInputTextarea] {
        min-height: 100px;
        resize: vertical;
      }
      .save-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
      }
      .sync-indicator {
        font-size: 0.85rem;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      @keyframes fa-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class PropertiesComponent {
  private modelService = inject(NgDiagramModelService);
  private selectionService = inject(NgDiagramSelectionService);
  private workflowService = inject(WorkflowService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  syncing = input<boolean>(false);
  saved = output<void>();
  deleted = output<string>();

  selection = this.selectionService.selection;
  selectedNode = computed(() => this.selection().nodes[0] ?? null);
  selectedEdge = computed(() => this.selection().edges[0] ?? null);

  nodeId = computed(() => this.selectedNode()?.id ?? '');
  
  editName = '';
  editDescription = '';
  saving = signal(false);
  deleting = signal(false);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' && this.selectedNode() && !this.saving() && !this.deleting() && !this.syncing()) {
      // Don't trigger if user is typing in an input/textarea
      const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        this.confirmDelete();
      }
    }
  }

  constructor() {
    effect(() => {
      const node = this.selectedNode();
      untracked(() => {
        if (node) {
          const data = node.data as any;
          this.editName = data.label || '';
          this.editDescription = data.description || '';
        } else {
          this.editName = '';
          this.editDescription = '';
        }
      });
    });
  }

  onNameChange(value: string) {
    const node = this.selectedNode();
    if (node) {
      this.modelService.updateNodeData(node.id, { 
        ...node.data,
        label: value 
      });
    }
  }

  onDescriptionChange(value: string) {
    const node = this.selectedNode();
    if (node) {
      this.modelService.updateNodeData(node.id, { 
        ...node.data,
        description: value 
      });
    }
  }

  saveNode() {
    const node = this.selectedNode();
    if (!node) return;

    const data = node.data as any;
    this.saving.set(true);
    
    this.workflowService.updateState(
      node.id, 
      this.editName, 
      this.editDescription, 
      data.concurrencyStamp
    ).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'State updated successfully' 
        });
        this.saved.emit();
      },
      error: (err) => {
        this.saving.set(false);
        let detail = 'Concurrency conflict or server error';
        if (err.status === 409 || err.error?.error?.code === 'AbpDbConcurrencyException') {
          detail = 'This state was modified by another user. Please refresh and try again.';
        } else if (err.error?.error?.message) {
          detail = err.error.error.message;
        }
        
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: detail
        });
      }
    });
  }

  confirmDelete() {
    const node = this.selectedNode();
    if (!node) return;
    const data = node.data as any;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the state "${data.label}"? This action cannot be undone.`,
      header: 'Delete State',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteNode(),
    });
  }

  deleteNode() {
    const node = this.selectedNode();
    if (!node) return;
    this.deleting.set(true);
    this.workflowService.deleteState(node.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.modelService.deleteNodes([node.id]);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'State deleted successfully',
        });
        this.deleted.emit(node.id);
      },
      error: () => {
        this.deleting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete state.',
        });
      },
    });
  }

  edgeLabel = computed(() => {
    const edge = this.selectedEdge() as any;
    return edge?.labels?.[0]?.data?.['label'] ?? edge?.data?.label ?? '';
  });

  updateEdgeLabel(value: string) {
    const edge = this.selectedEdge();
    if (edge) {
      this.modelService.updateEdges([
        {
          id: edge.id,
          labels: [{ id: 'label-1', data: { label: value }, positionOnEdge: 0.5 }],
        } as any,
      ]);
    }
  }
}
