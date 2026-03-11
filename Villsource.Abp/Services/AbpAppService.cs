using Volo.Abp.Application.Services;
using Villsource.Abp.Localization;

namespace Villsource.Abp.Services;

/* Inherit your application services from this class. */
public abstract class AbpAppService : ApplicationService
{
    protected AbpAppService()
    {
        LocalizationResource = typeof(AbpResource);
    }
}