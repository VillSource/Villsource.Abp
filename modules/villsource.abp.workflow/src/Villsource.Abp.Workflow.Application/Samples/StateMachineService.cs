using System;
using System.Threading.Tasks;
using Villsource.Abp.Workflow.Workflows;
using Volo.Abp.Domain.Repositories;

namespace Villsource.Abp.Workflow.Samples;

public class StateMachineService : WorkflowAppService, IStateMachineService
{
    private readonly IRepository<StateMachine, Guid> _stateMachineRepository;

    public StateMachineService(IRepository<StateMachine, Guid> stateMachineRepository)
    {
        _stateMachineRepository = stateMachineRepository;
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
}