namespace LifeWrapped.API.Models;

public class TemplatePhrase
{
    public string Key { get; set; } = string.Empty;
    public int Tier { get; set; } = 1;
    public double Threshold { get; set; }
    public List<string> Templates { get; set; } = [];
    public string Source { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
}