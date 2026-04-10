using LifeWrapped.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LifeWrapped.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<WrappedResult> WrappedResults { get; set; }
    public DbSet<GlobalAggregate> GlobalAggregates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WrappedResult>(entity =>
        {
            entity.ToTable("wrapped_results");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Token).HasColumnName("token").HasMaxLength(12).IsRequired();
            entity.HasIndex(e => e.Token).IsUnique();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.Property(e => e.Stats)
                .HasColumnName("stats")
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<LifeStats>(v, (JsonSerializerOptions?)null)!);

            entity.Property(e => e.Phrases)
                .HasColumnName("phrases")
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null)!);

            entity.Property(e => e.Sources)
                .HasColumnName("sources")
                .HasColumnType("text[]");
        });

        modelBuilder.Entity<GlobalAggregate>(entity =>
        {
            entity.ToTable("global_aggregates");
            entity.HasKey(e => e.StatKey);
            entity.Property(e => e.StatKey).HasColumnName("stat_key").HasMaxLength(100);
            entity.Property(e => e.Total).HasColumnName("total");
            entity.Property(e => e.Count).HasColumnName("count");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });
    }
}

public class GlobalAggregate
{
    public string StatKey { get; set; } = string.Empty;
    public long Total { get; set; }
    public int Count { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}