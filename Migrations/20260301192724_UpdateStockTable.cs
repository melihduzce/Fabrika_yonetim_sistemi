using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FabrikaBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStockTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Order",
                table: "Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "GrossWeightKg",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "ThicknessMm",
                table: "Stocks");

            migrationBuilder.RenameTable(
                name: "Order",
                newName: "Orders");

            migrationBuilder.RenameTable(
                name: "Customer",
                newName: "Customers");

            migrationBuilder.RenameColumn(
                name: "Unit",
                table: "Stocks",
                newName: "UnitPrice");

            migrationBuilder.RenameColumn(
                name: "StockCode",
                table: "Stocks",
                newName: "UnitCost");

            migrationBuilder.RenameColumn(
                name: "ProductCode",
                table: "Stocks",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "MaterialType",
                table: "Stocks",
                newName: "QuantityText");

            migrationBuilder.RenameColumn(
                name: "MaterialName",
                table: "Stocks",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Dimensions",
                table: "Stocks",
                newName: "Code");

            migrationBuilder.AlterColumn<double>(
                name: "Quantity",
                table: "Stocks",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Capacity",
                table: "Stocks",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CriticalLevel",
                table: "Stocks",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks",
                column: "Code");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                table: "Orders",
                column: "No");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                table: "Customers",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "CriticalLevel",
                table: "Stocks");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "Order");

            migrationBuilder.RenameTable(
                name: "Customers",
                newName: "Customer");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "Stocks",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "UnitCost",
                table: "Stocks",
                newName: "StockCode");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Stocks",
                newName: "ProductCode");

            migrationBuilder.RenameColumn(
                name: "QuantityText",
                table: "Stocks",
                newName: "MaterialType");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Stocks",
                newName: "MaterialName");

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "Stocks",
                newName: "Dimensions");

            migrationBuilder.AlterColumn<double>(
                name: "Quantity",
                table: "Stocks",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Stocks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Stocks",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Stocks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "GrossWeightKg",
                table: "Stocks",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ThicknessMm",
                table: "Stocks",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stocks",
                table: "Stocks",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Order",
                table: "Order",
                column: "No");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer",
                table: "Customer",
                column: "Id");
        }
    }
}
