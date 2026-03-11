using Volo.Abp.Modularity;

namespace Villsource.Abp;

[DependsOn(
    typeof(AbpDomainModule),
    typeof(AbpTestBaseModule)
)]
public class AbpDomainTestModule : AbpModule
{

}
