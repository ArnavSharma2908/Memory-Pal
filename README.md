# 🧠 Memory-Pal

An AI-powered adaptive learning platform that transforms your PDFs into personalized 7-day study plans with daily tests and interactive flashcards.

---

## ✨ Features

- � **PDF Processing**: Upload any PDF and extract meaningful content
- 🤖 **AI-Powered Analysis**: Uses Cohere AI to generate major topics
- 📅 **7-Day Study Plan**: Automatically creates a structured learning schedule
- 📝 **Daily Tests**: Generate custom tests for each day's material
- 🎴 **Flashcards**: Interactive flashcards for better retention
- 📊 **Progress Tracking**: Monitor your learning journey

---

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Cohere AI**: command-r-08-2024 model for content generation
- **pdfminer.six**: PDF text extraction
- **uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful UI components
- **Sonner**: Toast notifications

---

## � Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- Git
- Cohere API Key ([Get one here](https://cohere.ai/))

### 1️⃣ Clone the Repository
```cmd
git clone https://github.com/ArnavSharma2908/Memory-Pal.git
```

### 2️⃣ Navigate to Project Directory
```cmd
cd Memory-Pal
```

---

## 📦 Backend Setup

### 1️⃣ Navigate to Backend Directory
```cmd
cd backend
```

### 2️⃣ Create Virtual Environment
```cmd
python -m venv venv
```

### 3️⃣ Activate Virtual Environment
```cmd
venv\Scripts\activate
```

### 4️⃣ Install Dependencies
```cmd
pip install -r requirements.txt
```

### 5️⃣ Create Environment File
Create a `.env` file in the `backend` directory:
```env
COHERE_API_KEY=your_cohere_api_key_here
```

### 6️⃣ Start Backend Server
```cmd
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend will be running at **http://localhost:8000**

---

## 🎨 Frontend Setup

### 1️⃣ Open New Terminal & Navigate to Frontend Directory
```cmd
cd frontend
```
> **Note**: Make sure you're in the project root directory (Memory-Pal) before running this command.

### 2️⃣ Install Dependencies
```cmd
npm install
```

### 3️⃣ Start Development Server
```cmd
npm run dev
```

✅ Frontend will be running at **http://localhost:8080**

---

## � Run with Docker Compose (alternative)

Prefer running the whole app with Docker? Quick steps:

1. Initialize backend `.env` (replace with your real key):
```bash
COHERE_API_KEY=your_cohere_api_key_here
```

2. From project root start services:
```bash
docker compose up -d --build
```

Access after running:
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

Live (AWS EC2 t2.micro):
- Frontend: http://43.204.227.202:8080/
- Backend:  http://43.204.227.202:8000/

To stop: `docker compose down`

---

## �📂 Project Structure

```
📦 Sem 5 Mini Project
├── 📁 backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend Docker config
│   └── .env                # Environment variables
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API integration
│   │   └── App.tsx        # Main app component
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── Dockerfile         # Frontend Docker config
│
├── docker-compose.yml      # Multi-container orchestration
└── README.md              # You are here!
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload-pdf` | Upload PDF and extract text |
| `POST` | `/generate-topics` | Generate major topics from text |
| `POST` | `/generate-study-plan` | Create 7-day study plan |
| `POST` | `/generate-test` | Generate daily test questions |
| `POST` | `/generate-flashcards` | Create flashcards for topics |

---

## 💡 Usage

1. **Upload PDF**: Click the upload button and select your study material
2. **View Topics**: AI automatically extracts major topics from your PDF
3. **Get Study Plan**: Generate a personalized 7-day learning schedule
4. **Take Tests**: Complete daily tests to reinforce learning
5. **Use Flashcards**: Review with interactive flashcards


---

**Thank You! 🎓**
