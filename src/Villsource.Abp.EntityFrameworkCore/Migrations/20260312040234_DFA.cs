using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Villsource.Abp.Migrations
{
    /// <inheritdoc />
    public partial class DFA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VillsourceStateMachine",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillsourceStateMachine", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VillsourceStates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkflowId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    IsInitial = table.Column<bool>(type: "boolean", nullable: false),
                    IsFinish = table.Column<bool>(type: "boolean", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillsourceStates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VillsourceStates_VillsourceStateMachine_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "VillsourceStateMachine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VillsourceTransitions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkflowId = table.Column<Guid>(type: "uuid", nullable: false),
                    FromStateId = table.Column<Guid>(type: "uuid", nullable: false),
                    ToStateId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<int>(type: "integer", nullable: false),
                    Condition_ActorType = table.Column<int>(type: "integer", nullable: true),
                    Condition_Role = table.Column<string>(type: "text", nullable: true),
                    Condition_UserId = table.Column<string>(type: "text", nullable: true),
                    Condition_DepartmentId = table.Column<string>(type: "text", nullable: true),
                    Condition_RequireTopLevel = table.Column<bool>(type: "boolean", nullable: true),
                    Condition_RequireAtLestApprover = table.Column<int>(type: "integer", nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VillsourceTransitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VillsourceTransitions_VillsourceStateMachine_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "VillsourceStateMachine",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VillsourceTransitions_VillsourceStates_FromStateId",
                        column: x => x.FromStateId,
                        principalTable: "VillsourceStates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VillsourceTransitions_VillsourceStates_ToStateId",
                        column: x => x.ToStateId,
                        principalTable: "VillsourceStates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStates_WorkflowId",
                table: "VillsourceStates",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceTransitions_FromStateId",
                table: "VillsourceTransitions",
                column: "FromStateId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceTransitions_ToStateId",
                table: "VillsourceTransitions",
                column: "ToStateId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceTransitions_WorkflowId",
                table: "VillsourceTransitions",
                column: "WorkflowId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VillsourceTransitions");

            migrationBuilder.DropTable(
                name: "VillsourceStates");

            migrationBuilder.DropTable(
                name: "VillsourceStateMachine");
        }
    }
}
