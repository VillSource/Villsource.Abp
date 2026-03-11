using Volo.Abp.Modularity;

namespace Villsource.Abp;

public abstract class AbpApplicationTestBase<TStartupModule> : AbpTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
