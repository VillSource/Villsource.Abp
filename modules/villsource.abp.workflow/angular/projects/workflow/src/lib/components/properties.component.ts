import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { NgDiagramModelService, NgDiagramSelectionService } from 'ng-diagram';

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
  ],
  template: `
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
                id="node-name"
                [ngModel]="nodeLabel()"
                (ngModelChange)="updateNodeLabel($event)"
              />
              <label for="node-name">State Name</label>
            </p-floatLabel>

            <p-floatLabel variant="on">
              <textarea
                pInputTextarea
                id="node-desc"
                [ngModel]="$any(node.data).description"
                (ngModelChange)="updateNodeDescription($event)"
                rows="3"
              ></textarea>
              <label for="node-desc">Description</label>
            </p-floatLabel>
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

  selection = this.selectionService.selection;
  selectedNode = computed(() => this.selection().nodes[0] ?? null);
  selectedEdge = computed(() => this.selection().edges[0] ?? null);

  nodeLabel = computed(() => (this.selectedNode()?.data as any)?.label ?? '');
  edgeLabel = computed(() => {
    const edge = this.selectedEdge() as any;
    return edge?.labels?.[0]?.data?.['label'] ?? edge?.data?.label ?? '';
  });

  updateNodeLabel(value: string) {
    const node = this.selectedNode();
    if (node) {
      this.modelService.updateNodeData(node.id, { label: value });
    }
  }

  updateNodeDescription(value: string) {
    const node = this.selectedNode();
    if (node) {
      this.modelService.updateNodeData(node.id, { description: value });
    }
  }

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
