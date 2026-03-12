using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Villsource.Abp.Migrations
{
    /// <inheritdoc />
    public partial class DFA2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VillsourceStates_VillsourceStateMachine_WorkflowId",
                table: "VillsourceStates");

            migrationBuilder.DropForeignKey(
                name: "FK_VillsourceTransitions_VillsourceStateMachine_WorkflowId",
                table: "VillsourceTransitions");

            migrationBuilder.RenameColumn(
                name: "WorkflowId",
                table: "VillsourceTransitions",
                newName: "StateMachineId");

            migrationBuilder.RenameIndex(
                name: "IX_VillsourceTransitions_WorkflowId",
                table: "VillsourceTransitions",
                newName: "IX_VillsourceTransitions_StateMachineId");

            migrationBuilder.RenameColumn(
                name: "WorkflowId",
                table: "VillsourceStates",
                newName: "StateMachineId");

            migrationBuilder.RenameIndex(
                name: "IX_VillsourceStates_WorkflowId",
                table: "VillsourceStates",
                newName: "IX_VillsourceStates_StateMachineId");

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "VillsourceTransitions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "VillsourceStates",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "VillsourceStateMachine",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VillsourceStateMachineTransactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    StateMachineId = table.Column<Guid>(type: "uuid", nullable: false),
                    StateId = table.Column<Guid>(type: "uuid", nullable: false),
                    ActorUserId = table.Column<string>(type: "text", nullable: false),
                    ActionType = table.Column<int>(type: "integer", nullable: false),
                    Reference = table.Column<string>(type: "text", nullable: false),
                    Remark = table.Column<string>(type: "text", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillsourceStateMachineTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VillsourceStateMachineTransactions_VillsourceStateMachine_S~",
                        column: x => x.StateMachineId,
                        principalTable: "VillsourceStateMachine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VillsourceStateMachineTransactions_VillsourceStates_StateId",
                        column: x => x.StateId,
                        principalTable: "VillsourceStates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStateMachineTransactions_StateId",
                table: "VillsourceStateMachineTransactions",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStateMachineTransactions_StateMachineId",
                table: "VillsourceStateMachineTransactions",
                column: "StateMachineId");

            migrationBuilder.AddForeignKey(
                name: "FK_VillsourceStates_VillsourceStateMachine_StateMachineId",
                table: "VillsourceStates",
                column: "StateMachineId",
                principalTable: "VillsourceStateMachine",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VillsourceTransitions_VillsourceStateMachine_StateMachineId",
                table: "VillsourceTransitions",
                column: "StateMachineId",
                principalTable: "VillsourceStateMachine",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VillsourceStates_VillsourceStateMachine_StateMachineId",
                table: "VillsourceStates");

            migrationBuilder.DropForeignKey(
                name: "FK_VillsourceTransitions_VillsourceStateMachine_StateMachineId",
                table: "VillsourceTransitions");

            migrationBuilder.DropTable(
                name: "VillsourceStateMachineTransactions");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "VillsourceTransitions");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "VillsourceStates");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "VillsourceStateMachine");

            migrationBuilder.RenameColumn(
                name: "StateMachineId",
                table: "VillsourceTransitions",
                newName: "WorkflowId");

            migrationBuilder.RenameIndex(
                name: "IX_VillsourceTransitions_StateMachineId",
                table: "VillsourceTransitions",
                newName: "IX_VillsourceTransitions_WorkflowId");

            migrationBuilder.RenameColumn(
                name: "StateMachineId",
                table: "VillsourceStates",
                newName: "WorkflowId");

            migrationBuilder.RenameIndex(
                name: "IX_VillsourceStates_StateMachineId",
                table: "VillsourceStates",
                newName: "IX_VillsourceStates_WorkflowId");

            migrationBuilder.AddForeignKey(
                name: "FK_VillsourceStates_VillsourceStateMachine_WorkflowId",
                table: "VillsourceStates",
                column: "WorkflowId",
                principalTable: "VillsourceStateMachine",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VillsourceTransitions_VillsourceStateMachine_WorkflowId",
                table: "VillsourceTransitions",
                column: "WorkflowId",
                principalTable: "VillsourceStateMachine",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
