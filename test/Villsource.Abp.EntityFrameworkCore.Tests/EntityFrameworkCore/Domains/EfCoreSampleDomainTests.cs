using Villsource.Abp.Samples;
using Xunit;

namespace Villsource.Abp.EntityFrameworkCore.Domains;

[Collection(AbpTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<AbpEntityFrameworkCoreTestModule>
{

}
