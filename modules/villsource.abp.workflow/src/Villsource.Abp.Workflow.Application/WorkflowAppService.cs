using Villsource.Abp.Workflow.Localization;
using Volo.Abp.Application.Services;

namespace Villsource.Abp.Workflow;

public abstract class WorkflowAppService : ApplicationService
{
    protected WorkflowAppService()
    {
        LocalizationResource = typeof(WorkflowResource);
        ObjectMapperContext = typeof(WorkflowApplicationModule);
    }
}
