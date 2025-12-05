using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace CustomerSupportApp.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GeminiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Gemini:ApiKey"];
        }

        public async Task<string> GetResponseAsync(string prompt)
        {
            if (string.IsNullOrEmpty(_apiKey))
            {
                return "Error: API Key is missing in appsettings.json";
            }

           
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";
            Console.WriteLine($"DEBUG: API Key being used is: '{_apiKey}'");
            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorDetail = await response.Content.ReadAsStringAsync();
                   
                    return $"AI Error ({response.StatusCode}): {errorDetail}";
                }

                var resultJson = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(resultJson);

                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return text ?? "No response text found.";
            }
            catch (Exception ex)
            {
                return $"Exception: {ex.Message}";
            }
        }
    }
}