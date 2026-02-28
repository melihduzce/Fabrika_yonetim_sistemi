using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FabrikaBackend.Migrations
{
    /// <inheritdoc />
    public partial class PersonelVeStokGuncellemesi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Personnels",
                newName: "UsedLeave");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Personnels",
                newName: "Salary");

            migrationBuilder.AddColumn<int>(
                name: "AbsenteeismDays",
                table: "Personnels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "AverageDailyProduction",
                table: "Personnels",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Certifications",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Personnels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactName",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactPhone",
                table: "Personnels",
                type: "TEXT",
                maxLength: 11,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "HireDate",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Personnels",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "OvertimeHours",
                table: "Personnels",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PerformanceScore",
                table: "Personnels",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Personnels",
                type: "TEXT",
                maxLength: 11,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Personnels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RemainingLeave",
                table: "Personnels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TcNo",
                table: "Personnels",
                type: "TEXT",
                maxLength: 11,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalAnnualLeave",
                table: "Personnels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Stocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CompanyId = table.Column<int>(type: "INTEGER", nullable: false),
                    StockCode = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    ProductCode = table.Column<string>(type: "TEXT", nullable: false),
                    MaterialName = table.Column<string>(type: "TEXT", nullable: false),
                    MaterialType = table.Column<string>(type: "TEXT", nullable: false),
                    Dimensions = table.Column<string>(type: "TEXT", nullable: false),
                    ThicknessMm = table.Column<double>(type: "REAL", nullable: true),
                    GrossWeightKg = table.Column<double>(type: "REAL", nullable: true),
                    Quantity = table.Column<double>(type: "REAL", nullable: true),
                    Unit = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stocks", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stocks");

            migrationBuilder.DropColumn(
                name: "AbsenteeismDays",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "AverageDailyProduction",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "Certifications",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "Department",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "EmergencyContactName",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "EmergencyContactPhone",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "HireDate",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "OvertimeHours",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "PerformanceScore",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "RemainingLeave",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "TcNo",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "TotalAnnualLeave",
                table: "Personnels");

            migrationBuilder.RenameColumn(
                name: "UsedLeave",
                table: "Personnels",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "Salary",
                table: "Personnels",
                newName: "FullName");
        }
    }
}
