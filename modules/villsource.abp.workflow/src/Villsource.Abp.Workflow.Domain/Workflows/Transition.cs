using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Villsource.Abp.Workflow.Workflows;

public class Transition : AuditedAggregateRoot<Guid>
{
    public Guid WorkflowId { get; set; }
    public Guid FromStateId { get; set; }
    public Guid ToStateId { get; set; }

    public ActionType Action { get; set; }
    public TransitionCondition? Condition { get; set; }

    public virtual StateMachine? Workflow { get; set; }
    public virtual State? FromState { get; set; }
    public virtual State? ToState { get; set; }
}
