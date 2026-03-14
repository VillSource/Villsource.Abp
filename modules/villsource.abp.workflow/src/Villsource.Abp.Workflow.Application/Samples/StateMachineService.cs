using System;
using System.Threading.Tasks;
using Villsource.Abp.Workflow.Workflows;
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
        var machine = await _stateMachineRepository.FirstOrDefaultAsync();
        var entity = new State
        {
            Name = state.Name,
            Description = state.Description,
            StateMachineId = machine?.Id ?? Guid.Empty
        };
        await _stateRepository.InsertAsync(entity);
    }
}