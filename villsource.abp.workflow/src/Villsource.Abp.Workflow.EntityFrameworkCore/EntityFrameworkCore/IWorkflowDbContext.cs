using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Villsource.Abp.Workflow.EntityFrameworkCore;

[ConnectionStringName(WorkflowDbProperties.ConnectionStringName)]
public interface IWorkflowDbContext : IEfCoreDbContext
{
    /* Add DbSet for each Aggregate Root here. Example:
     * DbSet<Question> Questions { get; }
     */
}
