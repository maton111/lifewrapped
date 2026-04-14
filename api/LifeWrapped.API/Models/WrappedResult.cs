using System.Text.Json;

namespace LifeWrapped.API.Models;

public class WrappedResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Token { get; set; } = string.Empty;
    public LifeStats Stats { get; set; } = new();
    public List<PhraseResult> Phrases { get; set; } = [];
    public List<string> Sources { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}