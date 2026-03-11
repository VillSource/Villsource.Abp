using Villsource.Abp.Samples;
using Xunit;

namespace Villsource.Abp.EntityFrameworkCore.Applications;

[Collection(AbpTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<AbpEntityFrameworkCoreTestModule>
{

}
