using Volo.Abp.Modularity;

namespace Villsource.Abp;

[DependsOn(
    typeof(AbpApplicationModule),
    typeof(AbpDomainTestModule)
)]
public class AbpApplicationTestModule : AbpModule
{

}
