using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace Villsource.Abp.Workflow.Workflows;

public class StateMachine : AuditedAggregateRoot<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public virtual ICollection<State> States { get; set; } = [];
}
