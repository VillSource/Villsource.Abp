using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Villsource.Abp.Workflow.Workflows;

public class StateMachineTransaction : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId {  get; set; }
    public Guid StateMachineId { get; set; }
    public Guid StateId { get; set; }

    public string ActorUserId { get; set; } = string.Empty;
    public ActionType ActionType { get; set; }

    public string Reference { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;

    public virtual StateMachine? StateMachine { get; set; }
    public virtual State? State { get; set; }
}
