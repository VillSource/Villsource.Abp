using Villsource.Abp.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Villsource.Abp.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class AbpController : AbpControllerBase
{
    protected AbpController()
    {
        LocalizationResource = typeof(AbpResource);
    }
}
