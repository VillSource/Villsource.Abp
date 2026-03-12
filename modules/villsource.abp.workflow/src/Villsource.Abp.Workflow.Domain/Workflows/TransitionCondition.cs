namespace Villsource.Abp.Workflow.Workflows;

public class  TransitionCondition
{
    public ActorType ActorType { get; set; }
    public string? Role { get; set; }
    public string? UserId { get; set; }
    public string? DepartmentId { get; set; }
    public bool? RequireTopLevel { get; set; }
    public int? RequireAtLestApprover { get; set; }
}
