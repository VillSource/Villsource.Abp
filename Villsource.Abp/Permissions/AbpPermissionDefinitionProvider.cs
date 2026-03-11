using Villsource.Abp.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Villsource.Abp.Permissions;

public class AbpPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(AbpPermissions.GroupName);


        var booksPermission = myGroup.AddPermission(AbpPermissions.Books.Default, L("Permission:Books"));
        booksPermission.AddChild(AbpPermissions.Books.Create, L("Permission:Books.Create"));
        booksPermission.AddChild(AbpPermissions.Books.Edit, L("Permission:Books.Edit"));
        booksPermission.AddChild(AbpPermissions.Books.Delete, L("Permission:Books.Delete"));

        //Define your own permissions here. Example:
        //myGroup.AddPermission(AbpPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<AbpResource>(name);
    }
}
