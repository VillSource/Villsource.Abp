import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgDiagramModelService, NgDiagramSelectionService } from 'ng-diagram';

@Component({
  selector: 'lib-workflow-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  template: `
    <div class="properties-container" *ngIf="selectedNode() || selectedEdge()">
      <div class="properties-header">
        <i class="pi pi-sliders-h"></i>
        <span>Properties</span>
      </div>

      <div class="properties-content">
        <!-- Node Properties -->
        <div *ngIf="selectedNode() as node" class="property-group">
          <div class="group-label">STATE (NODE)</div>
          <div class="field">
            <label>Name</label>
            <input [ngModel]="nodeLabel()" (ngModelChange)="updateNodeLabel($event)" pInputText />
          </div>
          <div class="field">
            <label>Description</label>
            <textarea
              [ngModel]="$any(node.data).description"
              (ngModelChange)="updateNodeDescription($event)"
              class="p-inputtext"
              placeholder="Add description..."
            ></textarea>
          </div>
        </div>

        <!-- Edge Properties -->
        <div *ngIf="selectedEdge() as edge" class="property-group">
          <div class="group-label">TRANSITION (EDGE)</div>
          <div class="field">
            <label>Label</label>
            <input [ngModel]="edgeLabel()" (ngModelChange)="updateEdgeLabel($event)" pInputText />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .properties-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-top: 1rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .properties-header {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #334155;
    }
    .properties-content {
      padding: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
    }
    .property-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 200px;
    }
    .group-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .field label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
    }
    .field input {
      width: 100%;
    }
    .field textarea {
      width: 300px;
      height: 60px;
      resize: vertical;
    }
  `]
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
