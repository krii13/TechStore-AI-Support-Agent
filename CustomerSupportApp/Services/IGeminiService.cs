namespace CustomerSupportApp.Services
{
    public interface IGeminiService
    {
        Task<string> GetResponseAsync(string prompt);
    }
}