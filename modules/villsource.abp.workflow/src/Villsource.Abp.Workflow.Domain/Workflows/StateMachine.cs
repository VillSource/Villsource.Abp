using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Villsource.Abp.Workflow.Workflows;

public class StateMachine : AuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId {  get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public virtual ICollection<State> States { get; set; } = [];
}
