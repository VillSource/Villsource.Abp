using Volo.Abp.Modularity;

namespace Villsource.Abp;

/* Inherit from this class for your domain layer tests. */
public abstract class AbpDomainTestBase<TStartupModule> : AbpTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
