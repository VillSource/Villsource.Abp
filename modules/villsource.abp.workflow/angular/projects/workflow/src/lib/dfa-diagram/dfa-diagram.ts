import { Component, effect, inject, input, output, untracked, computed, Type } from '@angular/core';
import {
  NgDiagramComponent,
  NgDiagramModelService,
  NgDiagramService,
  NgDiagramViewportService,
  NgDiagramSelectionService,
  initializeModel,
  type Node,
  type Edge,
} from 'ng-diagram';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { type NodeDragEndedEvent } from 'ng-diagram';

@Component({
  selector: 'lib-dfa-diagram',
  standalone: true,
  imports: [NgDiagramComponent, CommonModule, FormsModule, InputTextModule, ButtonModule],
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

  initialStates = input<
    { id: string; name: string; description: string; positionX: number; positionY: number }[]
  >([]);

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

  async loadInitialStates(states: any[]) {
    const currentNodes = this.modelService.nodes();
    const currentNodeIds = new Set(currentNodes.map(n => n.id));
    const newStateIds = new Set(states.map(s => s.id));

    const nodesToAdd = states.filter(s => !currentNodeIds.has(s.id));
    const nodesToRemove = currentNodes.filter(n => !newStateIds.has(n.id));

    if (nodesToAdd.length === 0 && nodesToRemove.length === 0) {
      return;
    }

    await this.diagramService.transaction(
      async () => {
        // Remove nodes that are no longer in the state list
        if (nodesToRemove.length > 0) {
          this.modelService.deleteNodes(nodesToRemove.map(n => n.id));
          
          // Also clear edges if we are doing a full refresh (e.g. machine switch)
          if (states.length === 0) {
             const edges = this.modelService.edges();
             if (edges.length > 0) {
               this.modelService.deleteEdges(edges.map(e => e.id));
             }
          }
        }

        // Add only new nodes
        if (nodesToAdd.length > 0) {
          const newNodes: Node[] = nodesToAdd.map(s => ({
            id: s.id,
            position: { x: s.positionX ?? 0, y: s.positionY ?? 0 },
            data: { label: s.name, description: s.description },
          }));
          this.modelService.addNodes(newNodes);
        }
      },
      { waitForMeasurements: true },
    );

    // Zoom to fit when loading for the first time or when a new node is added
    if (states.length > 0 && (currentNodes.length === 0 || nodesToAdd.length > 0)) {
      this.viewportService.zoomToFit({ padding: 50 });
    }
  }

  manualZoomToFit() {
    this.viewportService.zoomToFit({ padding: 50 });
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
