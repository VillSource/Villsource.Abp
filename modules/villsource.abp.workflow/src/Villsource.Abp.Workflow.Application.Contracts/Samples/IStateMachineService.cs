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
    public Guid StateMachineId { get; set; }
    [Required]
    public required string Name { get; set; }
    [Required]
    public required string Description { get; set; }
    public double PositionX { get; set; }
    public double PositionY { get; set; }
}

public class StatePositionUpdateDto
{
    public double PositionX { get; set; }
    public double PositionY { get; set; }
}

public class StateListDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PositionX { get; set; }
    public double PositionY { get; set; }
}

public interface IStateMachineService : IApplicationService
{
    Task CreateWorkflow(StateMachineDto machine);
    Task<StateListDto> CreateState(StateDto state);
    Task UpdateStatePosition(Guid id, StatePositionUpdateDto input);
    Task<PagedResultDto<StateMachineListDto>> GetListAsync(PagedAndSortedResultRequestDto input);
    Task<List<StateListDto>> GetStatesAsync(Guid stateMachineId);
}