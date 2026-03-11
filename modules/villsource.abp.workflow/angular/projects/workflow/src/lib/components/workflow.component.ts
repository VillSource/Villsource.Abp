import { Component, inject } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';

@Component({
  selector: 'lib-workflow',
  template: ` <p>workflow works!</p> `,
})
export class WorkflowComponent {
  protected readonly service = inject(WorkflowService);

  constructor() {
    this.service.sample().subscribe(console.log);
  }
}
