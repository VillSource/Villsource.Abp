using Volo.Abp.Reflection;

namespace Villsource.Abp.Workflow.Permissions;

public class WorkflowPermissions
{
    public const string GroupName = "Workflow";

    public static string[] GetAll()
    {
        return ReflectionHelper.GetPublicConstantsRecursively(typeof(WorkflowPermissions));
    }
}
