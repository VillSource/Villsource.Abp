using Volo.Abp.Modularity;
using Volo.Abp.VirtualFileSystem;

namespace Villsource.Abp.Workflow;

[DependsOn(
    typeof(AbpVirtualFileSystemModule)
    )]
public class WorkflowInstallerModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<WorkflowInstallerModule>();
        });
    }
}
