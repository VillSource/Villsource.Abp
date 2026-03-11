using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Villsource.Abp.Workflow.EntityFrameworkCore;

[DependsOn(
    typeof(WorkflowDomainModule),
    typeof(AbpEntityFrameworkCoreModule)
)]
public class WorkflowEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAbpDbContext<WorkflowDbContext>(options =>
        {
            options.AddDefaultRepositories<IWorkflowDbContext>(includeAllEntities: true);
            
            /* Add custom repositories here. Example:
            * options.AddRepository<Question, EfCoreQuestionRepository>();
            */
        });
    }
}
