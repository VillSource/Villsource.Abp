using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace Villsource.Abp.Workflow.Samples;

// [Area(WorkflowRemoteServiceConsts.ModuleName)]
// [RemoteService(Name = WorkflowRemoteServiceConsts.RemoteServiceName)]
// [Route("api/workflow/state-machine")]
// public class StateMachineController : WorkflowController, IStateMachineService
// {
//     private readonly IStateMachineService _sampleAppService;
//
//     public StateMachineController(IStateMachineService sampleAppService)
//     {
//         _sampleAppService = sampleAppService;
//     }
//
//     [HttpGet]
//     public Task CreateWorkflow()
//     {
//         return _sampleAppService.CreateWorkflow();
//     }
// }

[Area(WorkflowRemoteServiceConsts.ModuleName)]
[RemoteService(Name = WorkflowRemoteServiceConsts.RemoteServiceName)]
[Route("api/workflow/example")]
public class ExampleController : WorkflowController, ISampleAppService
{
    private readonly ISampleAppService _sampleAppService;

    public ExampleController(ISampleAppService sampleAppService)
    {
        _sampleAppService = sampleAppService;
    }

    [HttpGet]
    public async Task<SampleDto> GetAsync()
    {
        return await _sampleAppService.GetAsync();
    }

    [HttpGet]
    [Route("authorized")]
    [Authorize]
    public async Task<SampleDto> GetAuthorizedAsync()
    {
        return await _sampleAppService.GetAsync();
    }
}
