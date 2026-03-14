import { Component, effect, inject, input, output, untracked } from '@angular/core';
import {
  NgDiagramComponent,
  NgDiagramModelService,
  NgDiagramService,
  NgDiagramViewportService,
  NgDiagramSelectionService,
  initializeModel,
  provideNgDiagram,
  type Node,
  type Edge,
} from 'ng-diagram';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { computed, Type } from '@angular/core';
import { type NodeDragEndedEvent } from 'ng-diagram';

@Component({
  selector: 'lib-dfa-diagram',
  standalone: true,
  imports: [NgDiagramComponent, CommonModule, FormsModule, InputTextModule],
  templateUrl: './dfa-diagram.html',
  styleUrl: './dfa-diagram.css',
})
export class DfaDiagram {
  private diagramService = inject(NgDiagramService);
  private modelService = inject(NgDiagramModelService);
  private viewportService = inject(NgDiagramViewportService);
  private selectionService = inject(NgDiagramSelectionService);

  selection = this.selectionService.selection;

  selectedNode = computed(() => this.selection().nodes[0] ?? null);
  selectedEdge = computed(() => this.selection().edges[0] ?? null);

  nodeLabel = computed(() => (this.selectedNode()?.data as any)?.label ?? '');
  edgeLabel = computed(() => {
    const edge = this.selectedEdge() as any;
    return edge?.labels?.[0]?.data?.['label'] ?? edge?.data?.label ?? '';
  });

  initialStates = input<{ id: string; name: string; description: string; positionX: number; positionY: number }[]>([]);

  nodeSelected = output<{ id: string; name: string; description: string } | null>();
  edgeSelected = output<{ id: string; label: string } | null>();
  nodePositionChanged = output<{ id: string; x: number; y: number }>();

  constructor() {
    effect(() => {
      const node = this.selectedNode();
      const label = this.nodeLabel(); // Trigger on label change too
      const description = (node?.data as any)?.description ?? '';

      untracked(() => {
        if (node) {
          this.nodeSelected.emit({
            id: node.id,
            name: label,
            description: description,
          });
        } else {
          this.nodeSelected.emit(null);
        }
      });
    });

    effect(() => {
      const edge = this.selectedEdge();
      const label = this.edgeLabel(); // Trigger on label change too

      untracked(() => {
        if (edge) {
          this.edgeSelected.emit({
            id: edge.id,
            label: label,
          });
        } else {
          this.edgeSelected.emit(null);
        }
      });
    });

    effect(() => {
      const states = this.initialStates();
      untracked(() => {
        if (states) {
          this.loadInitialStates(states);
        }
      });
    });
  }

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  config = computed(() => ({
    nodeDraggingEnabled: true,
  }));

  loadInitialStates(states: any[]) {
    const currentNodes = this.modelService.nodes();
    const isFirstLoad = currentNodes.length === 0;

    // Clear everything if we're reloading (simple strategy for now)
    if (!isFirstLoad) {
      this.modelService.deleteNodes(currentNodes.map(n => n.id));
      const currentEdges = this.modelService.edges();
      if (currentEdges.length > 0) {
        this.modelService.deleteEdges(currentEdges.map(e => e.id));
      }
    }

    const newNodes: Node[] = states.map(s => ({
      id: s.id,
      position: { x: s.positionX ?? 0, y: s.positionY ?? 0 },
      data: { label: s.name, description: s.description },
    }));

    this.modelService.addNodes(newNodes);

    if (isFirstLoad && newNodes.length > 0) {
      setTimeout(() => {
        this.viewportService.zoomToFit();
      }, 50);
    }
  }


  onNodeDragEnded(event: NodeDragEndedEvent) {
    event.nodes.forEach(node => {
      this.nodePositionChanged.emit({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
      });
    });
  }

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
