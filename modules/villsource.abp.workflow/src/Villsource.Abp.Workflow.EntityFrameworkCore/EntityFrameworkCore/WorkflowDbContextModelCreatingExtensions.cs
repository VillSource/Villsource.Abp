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
            workflow.HasIndex(x => x.TenantId);

            workflow
                .HasMany(x => x.States)
                .WithOne(x => x.StateMachine);
        });
        builder.Entity<State>(state =>
        {
            state.ToTable(WorkflowDbProperties.DbTablePrefix + "States", WorkflowDbProperties.DbSchema);
            state.ConfigureByConvention();
            state.HasIndex(x => x.TenantId);

            state.HasOne(x => x.StateMachine)
                .WithMany(x => x.States)
                .HasForeignKey(x => x.StateMachineId);
        });
        builder.Entity<Transition>(transition =>
        {
            transition.ToTable(WorkflowDbProperties.DbTablePrefix + "Transitions", WorkflowDbProperties.DbSchema);
            transition.ConfigureByConvention();
            transition.HasIndex(x => x.TenantId);

            transition.HasOne(x => x.StateMachine)
                .WithMany()
                .HasForeignKey(x => x.StateMachineId);
            transition.HasOne(x => x.FromState)
                .WithMany()
                .HasForeignKey(x => x.FromStateId);
            transition.HasOne(x => x.ToState)
                .WithMany()
                .HasForeignKey(x => x.ToStateId);
            transition.OwnsOne(x => x.Condition);
        });
        builder.Entity<StateMachineTransaction>(transaction =>
        {
            transaction.ToTable(WorkflowDbProperties.DbTablePrefix + "StateMachineTransactions", WorkflowDbProperties.DbSchema);
            transaction.ConfigureByConvention();
            transaction.HasIndex(x => x.TenantId);

            transaction.HasOne(x => x.StateMachine)
                .WithMany()
                .HasForeignKey(x => x.StateMachineId);
            transaction.HasOne(x => x.State)
                .WithMany()
                .HasForeignKey(x => x.StateId);
        });
    }
}
