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
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-dfa-diagram',
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

  constructor() {
    effect(() => {
      const state = this.stateInput();
      untracked(() => {
        console.log(state);
        if (state) {
          this.addNode(state);
        }
      });
    });
  }
  ngOnInit(): void {}

  model = initializeModel({
    nodes: [{ id: '1', position: { x: 100, y: 150 }, data: { label: 'Draft' } }],
    edges: [],
  });

  async addNode(state: { name: string; description: string }) {
    const nodes = this.modelService.nodes();
    const lastNode = nodes[nodes.length - 1];
    const newNode: Node = {
      id: state.name,
      position: { x: lastNode.position.x + 100 + lastNode.size.width, y: lastNode.position.y },
      data: { label: state.name },
    };

    this.modelService.addNodes([newNode]);
    // this.viewportService.zoomToFit();
  }
}
