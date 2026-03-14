import { inject, Injectable } from '@angular/core';
import { PagedAndSortedResultRequestDto, PagedResultDto, RestService } from '@abp/ng.core';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  apiName = 'Workflow';

  private restService = inject(RestService);

  sample() {
    return this.restService.request<void, any>(
      { method: 'GET', url: '/api/workflow/example' },
      { apiName: this.apiName },
    );
  }

  addStateMachine(name: string, description: string) {
    return this.restService.request<AddStateMachineDto, any>(
      { method: 'POST', url: '/api/app/state-machine/workflow', body: { name, description } },
      { apiName: this.apiName },
    );
  }

  addState(name: string, description: string) {
    return this.restService.request<StateDto, any>(
      { method: 'POST', url: '/api/app/state-machine/state', body: { name, description } },
      { apiName: this.apiName },
    );
  }

  getList(input: PagedAndSortedResultRequestDto) {
    return this.restService.request<PagedAndSortedResultRequestDto, PagedResultDto<StateMachineListDto>>(
      { method: 'GET', url: '/api/app/state-machine', params: input },
      { apiName: this.apiName },
    );
  }
}

export interface StateMachineListDto {
  id: string;
  name: string;
  description: string;
  stateCount: number;
  creatorId: string;
  creationTime: string;
}

interface AddStateMachineDto {
  name: string;
  description: string;
}

interface StateDto {
  name: string;
  description: string;
}
