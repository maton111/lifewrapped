using LifeWrapped.API.Models;

namespace LifeWrapped.API.Parsers;

public interface IDataParser
{
    Task<LifeStats> ParseAsync(Stream input);
}