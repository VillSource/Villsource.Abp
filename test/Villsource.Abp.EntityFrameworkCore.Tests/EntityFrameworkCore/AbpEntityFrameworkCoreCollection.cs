using Xunit;

namespace Villsource.Abp.EntityFrameworkCore;

[CollectionDefinition(AbpTestConsts.CollectionDefinitionName)]
public class AbpEntityFrameworkCoreCollection : ICollectionFixture<AbpEntityFrameworkCoreFixture>
{

}
