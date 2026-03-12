using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Villsource.Abp.Workflow.Workflows;

public class Transition : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid StateMachineId { get; set; }
    public Guid FromStateId { get; set; }
    public Guid ToStateId { get; set; }

    public ActionType Action { get; set; }
    public TransitionCondition? Condition { get; set; }

    public virtual StateMachine? StateMachine { get; set; }
    public virtual State? FromState { get; set; }
    public virtual State? ToState { get; set; }
}
