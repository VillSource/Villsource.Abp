import { eLayoutType, RoutesService } from '@abp/ng.core';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { eWorkflowRouteNames } from '../enums/route-names';

export const WORKFLOW_ROUTE_PROVIDERS = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

export function configureRoutes() {
  const routesService = inject(RoutesService);
  routesService.add([
    {
      path: '/workflow',
      name: eWorkflowRouteNames.Workflow,
      iconClass: 'fas fa-book',
      layout: eLayoutType.application,
      order: 3,
    },
  ]);
}

const WORKFLOW_PROVIDERS: EnvironmentProviders[] = [...WORKFLOW_ROUTE_PROVIDERS];

export function provideWorkflow() {
  return makeEnvironmentProviders(WORKFLOW_PROVIDERS);
}
