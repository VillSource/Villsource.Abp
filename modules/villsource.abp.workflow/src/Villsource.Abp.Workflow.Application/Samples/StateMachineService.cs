using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Villsource.Abp.Workflow.Workflows;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace Villsource.Abp.Workflow.Samples;

public class StateMachineService : WorkflowAppService, IStateMachineService
{
    private readonly IRepository<StateMachine, Guid> _stateMachineRepository;
    private readonly IRepository<State, Guid> _stateRepository;

    public StateMachineService(
        IRepository<StateMachine, Guid> stateMachineRepository,
        IRepository<State, Guid> stateRepository)
    {
        _stateMachineRepository = stateMachineRepository;
        _stateRepository = stateRepository;
    }

    public async Task CreateWorkflow(StateMachineDto machine)
    {
        var stateMachine = new StateMachine
        {
            Name =  machine.Name,
            Description = machine.Description
        };
        await _stateMachineRepository.InsertAsync(stateMachine);
    }

    public async Task CreateState(StateDto state)
    {
        var entity = new State
        {
            Name = state.Name,
            Description = state.Description,
            StateMachineId = state.StateMachineId
        };
        await _stateRepository.InsertAsync(entity);
    }

    public async Task<PagedResultDto<StateMachineListDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        if (input.Sorting.IsNullOrWhiteSpace())
        {
            input.Sorting = nameof(StateMachine.Name);
        }

        var totalCount = await _stateMachineRepository.GetCountAsync();

        var stateMachines = await _stateMachineRepository.GetPagedListAsync(
            input.SkipCount,
            input.MaxResultCount,
            input.Sorting,
            includeDetails: true
        );

        var list = stateMachines.Select(s => new StateMachineListDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            StateCount = s.States.Count,
            CreatorId = s.CreatorId,
            CreationTime = s.CreationTime
        }).ToList();

        return new PagedResultDto<StateMachineListDto>(totalCount, list);
    }

    public async Task<List<StateListDto>> GetStatesAsync(Guid stateMachineId)
    {
        var states = await _stateRepository.GetListAsync(s => s.StateMachineId == stateMachineId);
        return states.Select(s => new StateListDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description
        }).ToList();
    }
}