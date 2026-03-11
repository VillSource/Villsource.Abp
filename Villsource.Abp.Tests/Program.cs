using Microsoft.AspNetCore.Builder;
using Villsource.Abp;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
builder.Environment.ContentRootPath = GetWebProjectContentRootPathHelper.Get("Villsource.Abp.csproj");
await builder.RunAbpModuleAsync<AbpTestModule>(applicationName: "Villsource.Abp");
namespace Villsource.Abp
{
    public partial class Program
    {
    }
}
