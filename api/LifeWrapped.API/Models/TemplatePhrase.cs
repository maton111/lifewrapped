namespace LifeWrapped.API.Models;

public class TemplatePhrase
{
    public string Key { get; set; } = string.Empty;
    public double Threshold { get; set; }
    public string Template { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
}