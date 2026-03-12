using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Villsource.Abp.Workflow.Workflows;

public class WorkflowTransaction : AuditedAggregateRoot<Guid>
{
    public Guid WorkflowId { get; set; }
    public Guid StateId { get; set; }

    public string ActorUserId { get; set; } = string.Empty;
    public ActionType ActionType { get; set; }

    public string Reference { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;

    public virtual StateMachine? Workflow { get; set; }
    public virtual State? State { get; set; }
}
