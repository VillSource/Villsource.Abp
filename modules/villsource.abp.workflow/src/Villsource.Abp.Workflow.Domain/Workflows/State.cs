
using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Villsource.Abp.Workflow.Workflows;

public class State : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid StateMachineId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsInitial { get; set; }
    public bool IsFinish { get; set; }

    public virtual StateMachine? StateMachine { get; set; }
}
