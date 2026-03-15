using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FabrikaBackend.Migrations
{
    public partial class AddMusteriUrunAdiToOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MusteriAdi",
                table: "Orders",
                type: "TEXT",
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "UrunAdi",
                table: "Orders",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "MusteriAdi", table: "Orders");
            migrationBuilder.DropColumn(name: "UrunAdi", table: "Orders");
        }
    }
}
