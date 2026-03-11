import { RouterOutletComponent } from '@abp/ng.core';
import { Routes } from '@angular/router';

export const WORKFLOW_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RouterOutletComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/workflow.component').then(c => c.WorkflowComponent),
      },
    ],
  },
];
