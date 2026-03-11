using Volo.Abp.Modularity;

namespace Villsource.Abp.Workflow;

[DependsOn(
    typeof(WorkflowApplicationModule),
    typeof(WorkflowDomainTestModule)
    )]
public class WorkflowApplicationTestModule : AbpModule
{

}
