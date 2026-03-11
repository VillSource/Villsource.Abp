using System.Threading.Tasks;

namespace Villsource.Abp.Data;

public interface IAbpDbSchemaMigrator
{
    Task MigrateAsync();
}
