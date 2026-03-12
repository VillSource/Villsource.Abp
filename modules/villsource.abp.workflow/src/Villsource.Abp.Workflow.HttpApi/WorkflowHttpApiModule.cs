using Localization.Resources.AbpUi;
using Villsource.Abp.Workflow.Localization;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Microsoft.Extensions.DependencyInjection;

namespace Villsource.Abp.Workflow;

[DependsOn(
    typeof(WorkflowApplicationContractsModule),
    typeof(AbpAspNetCoreMvcModule))]
public class WorkflowHttpApiModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<IMvcBuilder>(mvcBuilder =>
        {
            mvcBuilder.AddApplicationPartIfNotExists(typeof(WorkflowHttpApiModule).Assembly);
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<WorkflowResource>()
                .AddBaseTypes(typeof(AbpUiResource));
        });
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers.Create(typeof(WorkflowApplicationModule).Assembly);
        });
    }
}
