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

  addState(
    name: string,
    description: string,
    stateMachineId: string,
    positionX: number,
    positionY: number,
  ) {
    return this.restService.request<StateDto, StateListDto>(
      {
        method: 'POST',
        url: '/api/app/state-machine/state',
        body: { name, description, stateMachineId, positionX, positionY },
      },
      { apiName: this.apiName },
    );
  }

  updateStatePosition(id: string, positionX: number, positionY: number) {
    return this.restService.request<any, { concurrencyStamp: string }>(
      {
        method: 'PUT',
        url: `/api/app/state-machine/${id}/state-position`,
        body: { positionX, positionY },
      },
      { apiName: this.apiName },
    );
  }

  getList(input: PagedAndSortedResultRequestDto) {
    return this.restService.request<
      PagedAndSortedResultRequestDto,
      PagedResultDto<StateMachineListDto>
    >({ method: 'GET', url: '/api/app/state-machine', params: input }, { apiName: this.apiName });
  }

  getStates(stateMachineId: string) {
    return this.restService.request<void, StateListDto[]>(
      { method: 'GET', url: `/api/app/state-machine/states/${stateMachineId}` },
      { apiName: this.apiName },
    );
  }

  updateState(id: string, name: string, description: string, concurrencyStamp?: string) {
    return this.restService.request<any, void>(
      {
        method: 'PUT',
        url: `/api/app/state-machine/${id}/state`,
        body: { name, description, concurrencyStamp },
      },
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

export interface StateListDto {
  id: string;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  concurrencyStamp?: string;
}

interface AddStateMachineDto {
  name: string;
  description: string;
}

interface StateDto {
  stateMachineId: string;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
}
