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
import { computed } from '@angular/core';

@Component({
  selector: 'lib-dfa-diagram',
  standalone: true,
  imports: [NgDiagramComponent, CommonModule, FormsModule, InputTextModule],
  providers: [provideNgDiagram()],
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

  stateInput = input<{ name: string; description: string }>();
  initialStates = input<{ id: string; name: string; description: string }[]>([]);

  nodeSelected = output<{ id: string; name: string; description: string } | null>();
  edgeSelected = output<{ id: string; label: string } | null>();

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
      const state = this.stateInput();
      untracked(() => {
        if (state) {
          this.addNode(state);
        }
      });
    });

    effect(() => {
      const states = this.initialStates();
      untracked(() => {
        const currentNodes = this.modelService.nodes();
        const currentEdges = this.modelService.edges();

        if (currentNodes.length > 0) {
          this.modelService.deleteNodes(currentNodes.map(n => n.id));
        }
        if (currentEdges.length > 0) {
          this.modelService.deleteEdges(currentEdges.map(e => e.id));
        }

        if (states && states.length > 0) {
          this.loadInitialStates(states);
        }
      });
    });
  }

  model = initializeModel({
    nodes: [],
    edges: [],
  });

  loadInitialStates(states: { name: string }[]) {
    const newNodes: Node[] = states.map((s, index) => ({
      id: s.name,
      position: { x: index * 250, y: 0 },
      data: { label: s.name },
    }));

    this.modelService.addNodes(newNodes);
    setTimeout(() => {
      this.viewportService.zoomToFit();
    }, 50);
  }

  async addNode(state: { name: string; description: string }) {
    const nodes = this.modelService.nodes();
    const lastNode = nodes[nodes.length - 1];

    const x = lastNode ? lastNode.position.x + 250 : 100;
    const y = lastNode ? lastNode.position.y : 0;

    const newNode: Node = {
      id: state.name + Date.now(),
      position: { x, y },
      data: { label: state.name },
    };

    this.modelService.addNodes([newNode]);

    setTimeout(() => {
      this.viewportService.zoomToFit();
    }, 50);
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
