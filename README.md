# 🛍️ TechStore AI Support Agent

A Full-Stack **RAG (Retrieval-Augmented Generation)** application that serves as an intelligent customer support agent. Unlike standard chatbots, this agent connects to a live SQL inventory database to provide accurate, real-time product recommendations, check stock, and display rich media (product cards) within the chat interface.

---

## 📸 Screenshots

### 1. Smart Chat Interface (RAG in Action)
https://prnt.sc/aSf6bpy2M7v7
https://prnt.sc/9_g16Hs4iymN

### 2. Secure Login (JWT Auth)
https://prnt.sc/0z5jyDDWXpv9


---

## 🚀 Key Features

* **🧠 RAG Architecture:** Integrates Google Gemini 2.5 Flash with a SQL Server database. The AI prompt is dynamically injected with real-time inventory data, ensuring the bot never "hallucinates" products that don't exist.
* **💾 Contextual Memory:** Implements a sliding window context system. The agent remembers conversation history (stored in SQL), allowing users to ask follow-up questions like *"How much is it?"* naturally.
* **🔐 Secure Authentication:** Built from scratch using **JWT (JSON Web Tokens)**. Supports secure User Registration and Login with hashed passwords (BCrypt).
* **🎨 Rich UI/UX:** React frontend featuring a modern, responsive design with dark mode elements, glassmorphism login, and interactive product carousels inside the chat.
* **🔄 ETL Data Pipeline:** Includes an automated data ingestion service that syncs inventory from external APIs (FakeStoreAPI) to the local database, demonstrating real-world data integration skills.

---

## 🛠️ Tech Stack

### Frontend
* **React.js (v18)** - Component-based UI.
* **Axios** - API communication with interceptors for JWT injection.
* **React Router** - Single Page Application (SPA) navigation.
* **CSS Modules** - Responsive, modern styling.

### Backend
* **ASP.NET Core 8 Web API** - High-performance REST API.
* **Entity Framework Core** - ORM for SQL Server management.
* **Google Gemini API** - Generative AI model integration.
* **Swagger/OpenAPI** - API testing and documentation.

### Database
* **SQL Server** - Relational database for Users, Products, and Chat Logs.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* Node.js & npm
* .NET 8 SDK
* SQL Server (LocalDB or Azure SQL)

### 1. Backend Setup (.NET)
1.  Navigate to the backend folder:
    ```bash
    cd CustomerSupportApp
    ```
2.  Update `appsettings.json` with your API Key and Connection String.
    * *Note: Get a free API Key from [Google AI Studio](https://aistudio.google.com/).*
    ```json
    "Gemini": {
      "ApiKey": "YOUR_REAL_API_KEY_HERE"
    },
    "ConnectionStrings": {
      "DefaultConnection": "Server=.;Database=SupportBotDb;Trusted_Connection=True;TrustServerCertificate=True;"
    }
    ```
3.  Run Database Migrations (Creates the DB automatically):
    ```bash
    dotnet ef database update
    ```
4.  Start the API:
    ```bash
    dotnet run
    ```
    *The API will run at `https://localhost:7171`*

### 2. Frontend Setup (React)
1.  Navigate to the frontend folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of `client` folder:
    ```env
    REACT_APP_API_URL=https://localhost:7171/api
    ```
4.  Start the React App:
    ```bash
    npm start
    ```
    *The App will run at `http://localhost:3000`*

---

## 🧪 How to Use

1.  **Seed Data:** Upon first run, the database will be empty. Use Swagger or Postman to POST to `/api/Chat/sync-products` to fetch 20 real products from the web.
2.  **Register:** Create a new account on the Login page.
3.  **Chat:** Ask questions like:
    * *"What laptops do you have?"*
    * *"Show me men's clothing."*
    * *"Tell me more about the backpack."*

---

## 🔮 Future Improvements
* **Stripe Integration:** Allow users to add items to a cart and purchase directly within the chat.
* **Voice Support:** Add Speech-to-Text so users can talk to the agent.
* **Admin Dashboard:** A React Admin panel to manually add/edit inventory.

---

## 👤 Author
**Krina Patel**
* Full Stack Developer (.NET + React)
