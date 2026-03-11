using Volo.Abp.Modularity;

namespace Villsource.Abp.Workflow;

[DependsOn(
    typeof(WorkflowDomainModule),
    typeof(WorkflowTestBaseModule)
)]
public class WorkflowDomainTestModule : AbpModule
{

}
