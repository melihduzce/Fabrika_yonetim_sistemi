using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FabrikaBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ErrorCode",
                table: "Machines");

            migrationBuilder.RenameColumn(
                name: "Yetkili",
                table: "Customers",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "Unvan",
                table: "Customers",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "Tel",
                table: "Customers",
                newName: "Email");

            migrationBuilder.AlterColumn<string>(
                name: "ProductId",
                table: "StockTransactions",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Customers",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Customers",
                newName: "Yetkili");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Customers",
                newName: "Unvan");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Customers",
                newName: "Tel");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "StockTransactions",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "ErrorCode",
                table: "Machines",
                type: "TEXT",
                nullable: true);
        }
    }
}
