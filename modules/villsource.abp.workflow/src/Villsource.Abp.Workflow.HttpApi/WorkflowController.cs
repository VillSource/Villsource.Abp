using Villsource.Abp.Workflow.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Villsource.Abp.Workflow;

public abstract class WorkflowController : AbpControllerBase
{
    protected WorkflowController()
    {
        LocalizationResource = typeof(WorkflowResource);
    }
}
