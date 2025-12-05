using CustomerSupportApp.Models;
using CustomerSupportApp.Models; // Update namespace

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
       
        context.Database.EnsureCreated();

        
        if (context.Products.Any())
        {
            return;   
        }

        
        var products = new Product[]
        {
            new Product { Name = "TechPro Laptop X1", Description = "High performance laptop with 32GB RAM and RTX 4060.", Price = 1200.00M },
            new Product { Name = "Galaxy SmartWatch", Description = "Tracks heart rate, sleep, and GPS. Waterproof.", Price = 199.99M },
            new Product { Name = "NoiseCanceller 5000", Description = "Wireless headphones with active noise cancellation and 20h battery.", Price = 89.50M },
            new Product { Name = "ErgoChair Bliss", Description = "Ergonomic office chair with lumbar support.", Price = 250.00M }
        };

        context.Products.AddRange(products);
        context.SaveChanges();
    }
}