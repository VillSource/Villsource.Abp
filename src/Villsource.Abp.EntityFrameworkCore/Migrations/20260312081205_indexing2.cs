using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Villsource.Abp.Migrations
{
    /// <inheritdoc />
    public partial class indexing2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_VillsourceTransitions_TenantId",
                table: "VillsourceTransitions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStates_TenantId",
                table: "VillsourceStates",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStateMachineTransactions_TenantId",
                table: "VillsourceStateMachineTransactions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_VillsourceStateMachine_TenantId",
                table: "VillsourceStateMachine",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_VillsourceTransitions_TenantId",
                table: "VillsourceTransitions");

            migrationBuilder.DropIndex(
                name: "IX_VillsourceStates_TenantId",
                table: "VillsourceStates");

            migrationBuilder.DropIndex(
                name: "IX_VillsourceStateMachineTransactions_TenantId",
                table: "VillsourceStateMachineTransactions");

            migrationBuilder.DropIndex(
                name: "IX_VillsourceStateMachine_TenantId",
                table: "VillsourceStateMachine");
        }
    }
}
