using Volo.Abp.Modularity;

namespace Villsource.Abp.Workflow;

/* Inherit from this class for your domain layer tests.
 * See SampleManager_Tests for example.
 */
public abstract class WorkflowDomainTestBase<TStartupModule> : WorkflowTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
