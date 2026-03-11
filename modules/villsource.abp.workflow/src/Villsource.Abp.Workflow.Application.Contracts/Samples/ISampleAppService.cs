using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Villsource.Abp.Workflow.Samples;

public interface ISampleAppService : IApplicationService
{
    Task<SampleDto> GetAsync();

    Task<SampleDto> GetAuthorizedAsync();
}
