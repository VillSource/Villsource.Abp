using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Villsource.Abp.Workflow.Samples;

public class StateMachineDto
{
    [Required]
    public required string Name { get; set; }
    [Required]
    public required string Description { get; set; }
}
public class StateDto
{
    [Required]
    public required string Name { get; set; }
    [Required]
    public required string Description { get; set; }
}

public interface IStateMachineService : IApplicationService
{
    Task CreateWorkflow(StateMachineDto machine);
    Task CreateState(StateDto state);
}