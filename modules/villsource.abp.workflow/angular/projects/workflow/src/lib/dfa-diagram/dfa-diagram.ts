import { Component, effect, inject, input, untracked } from '@angular/core';
import {
  NgDiagramComponent,
  NgDiagramModelService,
  NgDiagramService,
  NgDiagramViewportService,
  initializeModel,
  provideNgDiagram,
  type Node,
} from 'ng-diagram';

@Component({
  selector: 'lib-dfa-diagram',
  standalone: true,
  imports: [NgDiagramComponent],
  providers: [provideNgDiagram()],
  templateUrl: './dfa-diagram.html',
  styleUrl: './dfa-diagram.css',
})
export class DfaDiagram {
  private diagramService = inject(NgDiagramService);
  private modelService = inject(NgDiagramModelService);
  private viewportService = inject(NgDiagramViewportService);

  stateInput = input<{ name: string; description: string }>();
  initialStates = input<{ id: string; name: string; description: string }[]>([]);

  constructor() {
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
}
