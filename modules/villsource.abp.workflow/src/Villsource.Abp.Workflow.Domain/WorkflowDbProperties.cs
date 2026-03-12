namespace Villsource.Abp.Workflow;

public static class WorkflowDbProperties
{
    public static string DbTablePrefix { get; set; } = "Villsource";

    public static string? DbSchema { get; set; } = null;

    public const string ConnectionStringName = "VillsourceWorkflow";
}
