using Microsoft.EntityFrameworkCore;
using Villsource.Abp.Workflow.Workflows;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Villsource.Abp.Workflow.EntityFrameworkCore;

public static class WorkflowDbContextModelCreatingExtensions
{
    public static void ConfigureWorkflow(
        this ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        /* Configure all entities here. Example:

        builder.Entity<Question>(b =>
        {
            //Configure table & schema name
            b.ToTable(WorkflowDbProperties.DbTablePrefix + "Questions", WorkflowDbProperties.DbSchema);

            b.ConfigureByConvention();

            //Properties
            b.Property(q => q.Title).IsRequired().HasMaxLength(QuestionConsts.MaxTitleLength);

            //Relations
            b.HasMany(question => question.Tags).WithOne().HasForeignKey(qt => qt.QuestionId);

            //Indexes
            b.HasIndex(q => q.CreationTime);
        });
        */

        builder.Entity<StateMachine>(workflow =>
        {
            workflow.ToTable(WorkflowDbProperties.DbTablePrefix + "StateMachine", WorkflowDbProperties.DbSchema);
            workflow.ConfigureByConvention();
            workflow
                .HasMany(x => x.States)
                .WithOne(x => x.Workflow);
        });
        builder.Entity<State>(state =>
        {
            state.ToTable(WorkflowDbProperties.DbTablePrefix + "States", WorkflowDbProperties.DbSchema);
            state.ConfigureByConvention();
            state.HasOne(x => x.Workflow)
                .WithMany(x => x.States)
                .HasForeignKey(x => x.WorkflowId);
        });
        builder.Entity<Transition>(transition =>
        {
            transition.ToTable(WorkflowDbProperties.DbTablePrefix + "Transitions", WorkflowDbProperties.DbSchema);
            transition.ConfigureByConvention();

            transition.HasOne(x => x.Workflow)
                .WithMany()
                .HasForeignKey(x => x.WorkflowId);
            transition.HasOne(x => x.FromState)
                .WithMany()
                .HasForeignKey(x => x.FromStateId);
            transition.HasOne(x => x.ToState)
                .WithMany()
                .HasForeignKey(x => x.ToStateId);
            transition.OwnsOne(x => x.Condition);
        });

    }
}
