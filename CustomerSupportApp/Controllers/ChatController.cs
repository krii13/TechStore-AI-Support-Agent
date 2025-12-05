using CustomerSupportApp.Models;
using CustomerSupportApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Net.Http;
using System.Text.Json;


namespace CustomerSupportApp.Controllers
{
   
    public class ChatRequest
    {
        public string UserMessage { get; set; } = "";
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IGeminiService _geminiService;

        public ChatController(AppDbContext context, IGeminiService geminiService)
        {
            _context = context;
            _geminiService = geminiService;
        }
        // Helper class to map the incoming JSON from FakeStoreAPI
        public class FakeProductDto
        {
            public string title { get; set; }
            public decimal price { get; set; }
            public string description { get; set; }
            public string category { get; set; }
            public string image { get; set; } 
        }

        [HttpPost("sync-products")]
        public async Task<IActionResult> SyncProducts()
        {
            try
            {
                using var client = new HttpClient();
                //  Fetch data from the external API
                var response = await client.GetAsync("https://fakestoreapi.com/products");

                if (!response.IsSuccessStatusCode)
                    return BadRequest("Failed to connect to external API.");

                var json = await response.Content.ReadAsStringAsync();

               
                var fakeProducts = JsonSerializer.Deserialize<List<FakeProductDto>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                int addedCount = 0;

               
                foreach (var fp in fakeProducts)
                {
                   
                    if (!_context.Products.Any(p => p.Name == fp.title))
                    {
                        var newProduct = new Product
                        {
                            Name = fp.title,
                            Price = fp.price,
                            Description = fp.description,
                            Category = fp.category,
                            ImageUrl = fp.image
                        };

                        _context.Products.Add(newProduct);
                        addedCount++;
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Sync Success! Added {addedCount} new products." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.UserMessage)) return BadRequest("Message empty");

            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
            var userId = int.Parse(userIdString);

            // Save Current User Message
            _context.ChatMessages.Add(new ChatMessage
            {
                UserId = userId,
                Content = request.UserMessage,
                IsBot = false,
                Timestamp = DateTime.Now
            });
         
            await _context.SaveChangesAsync();

         
            var products = await _context.Products.ToListAsync();
           
            var productContext = products.Any()
                 ? string.Join("\n", products.Select(p => $"- [{p.Category}] {p.Name}: ${p.Price}. Features: {p.Description}"))
                 : "No products available.";

          
            var rawHistory = await _context.ChatMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.Timestamp)
                .Take(6) 
                .OrderBy(m => m.Timestamp) 
                .ToListAsync();

            // Format history as a script
            var historyText = "";
            foreach (var msg in rawHistory)
            {
                var role = msg.IsBot ? "Agent" : "User";
                historyText += $"{role}: {msg.Content}\n";
            }

          
            var prompt = $@"
    You are a support agent for a tech store.
    
    INVENTORY:
    {productContext}

    CONVERSATION HISTORY:
    {historyText}

    INSTRUCTIONS:
    - LISTING ITEMS: If the user asks for a category (e.g., 'Show me jackets'), list the items with ONLY Name and Price. Keep it brief.
    - SPECIFIC DETAILS: If the user asks about a SPECIFIC item (e.g., 'Tell me about the cotton jacket'), THEN use the 'Features' info to give a full description.
    - UNKNOWN ITEMS: If asked for something not in the inventory, politely say you don't carry that.
    - Use the HISTORY to understand the context.
    - If the user says 'ok' or 'thanks', look at the previous Agent message to understand what they are agreeing to.
    - Tone: Be concise, professional, and friendly.

    User's Latest Reply: {request.UserMessage}";

            //  Send to Gemini
            string aiResponse = await _geminiService.GetResponseAsync(prompt);

            // Save AI Response
            _context.ChatMessages.Add(new ChatMessage
            {
                UserId = userId,
                Content = aiResponse,
                IsBot = true,
                Timestamp = DateTime.Now
            });

            await _context.SaveChangesAsync();

            var suggestedProducts = products
         .Where(p =>
           
             (p.Category != null && aiResponse.Contains(p.Category, StringComparison.OrdinalIgnoreCase))
             ||
             
             p.Name.Split(' ')
                   .Where(word => word.Length > 3) 
                   .Count(word => aiResponse.Contains(word, StringComparison.OrdinalIgnoreCase)) >= 2
         )
         .Take(4)
         .ToList();

            return Ok(new
            {
                response = aiResponse,
                products = suggestedProducts
            });


        }
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();
            var userId = int.Parse(userIdString);

            var history = await _context.ChatMessages
                .Where(m => m.UserId == userId)
                .OrderBy(m => m.Timestamp)
                .ToListAsync();

            return Ok(history);
        }
    }
}