using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Villsource.Abp.Workflow.Samples;

public class StateMachineDto
{
    [Required]
    public required string Name { get; set; }
    [Required]
    public required string Description { get; set; }
}

public class StateMachineListDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int StateCount { get; set; }
    public Guid? CreatorId { get; set; }
    public DateTime CreationTime { get; set; }
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
    Task<PagedResultDto<StateMachineListDto>> GetListAsync(PagedAndSortedResultRequestDto input);
}