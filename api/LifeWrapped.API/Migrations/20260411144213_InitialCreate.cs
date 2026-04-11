using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeWrapped.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "global_aggregates",
                columns: table => new
                {
                    stat_key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    total = table.Column<long>(type: "bigint", nullable: false),
                    count = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_global_aggregates", x => x.stat_key);
                });

            migrationBuilder.CreateTable(
                name: "wrapped_results",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    token = table.Column<string>(type: "character varying(12)", maxLength: 12, nullable: false),
                    stats = table.Column<string>(type: "jsonb", nullable: false),
                    phrases = table.Column<string>(type: "jsonb", nullable: false),
                    sources = table.Column<List<string>>(type: "text[]", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wrapped_results", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_wrapped_results_token",
                table: "wrapped_results",
                column: "token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "global_aggregates");

            migrationBuilder.DropTable(
                name: "wrapped_results");
        }
    }
}
