from fastapi import FastAPI, File, UploadFile, HTTPException
import random
import json
import pdf_parser
import os
from dotenv import load_dotenv
import cohere
from fastapi.middleware.cors import CORSMiddleware
import asyncio




load_dotenv()
co = cohere.Client(os.getenv("COHERE_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"] for stricter control
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
major_topics = []
# --- Sample data ---


# --- Upload PDF ---
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    content = await file.read()
    # Parse PDF and extract topics
    major_topics[:] = pdf_parser.parse(content)
    

    return {
        "filename": file.filename,
        "size": len(content),
        "message": "PDF uploaded successfully",
    }

# --- Get Random Flashcard ---
@app.get("/flashcard/")
async def get_flashcard():
    if not major_topics:
        raise HTTPException(status_code=404, detail="No topics available. Upload a PDF first.")
    
    topic = random.choice(major_topics)
    prompt = f"""Generate ONE flashcard question and answer about the topic: {topic}

Return ONLY valid JSON with no markdown, no code blocks, no extra text:
{{"question": "question text here", "answer": "answer text here"}}"""
    
    try:
        response = await asyncio.to_thread(co.chat, message=prompt, model="command-r-08-2024")
        flashcard = json.loads(response.text)
        if isinstance(flashcard, dict) and "question" in flashcard and "answer" in flashcard:
            return flashcard
    except (json.JSONDecodeError, AttributeError):
        pass
    
    raise HTTPException(status_code=500, detail="Failed to generate flashcard")


# --- Get Test by ID ---
@app.get("/test/{test_id}")
async def get_test(test_id: int):
    if test_id < 1 or test_id > 7:
        raise HTTPException(status_code=404, detail="Test not found (choose between 1–7)")
    if not major_topics:
        raise HTTPException(status_code=404, detail="No topics available. Upload a PDF first.")

    def _extract_json(text: str):
        try:
            return json.loads(text)
        except Exception:
            if "```json" in text:
                block = text.split("```json", 1)[1].split("```", 1)[0].strip()
                return json.loads(block)
            if "```" in text:
                block = text.split("```", 1)[1].split("```", 1)[0].strip()
                return json.loads(block)
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                return json.loads(text[start:end+1])
            raise

    async def generate_question(qnum: int):
        topic = random.choice(major_topics)
        prompt = f"""Create ONE multiple-choice question (with four options) about this topic: {topic}

The JSON object MUST have exactly these keys and no extra text or markdown:
{{"question": "Question {qnum} of Test {test_id}: <question text>", "options": ["opt1", "opt2", "opt3", "opt4"], "correct_answer": 1}}

Return ONLY valid JSON. "correct_answer" must be an integer 1-4 indicating the correct option. Do NOT include any explanation, commentary, or markdown."""

        for attempt in range(3):
            try:
                resp = await asyncio.to_thread(co.chat, message=prompt, model="command-r-08-2024")
                payload = _extract_json(resp.text)
                if (
                    isinstance(payload, dict)
                    and isinstance(payload.get("question"), str)
                    and isinstance(payload.get("options"), list)
                    and len(payload["options"]) == 4
                    and all(isinstance(o, str) for o in payload["options"])
                    and isinstance(payload.get("correct_answer"), int)
                    and 1 <= payload["correct_answer"] <= 4
                ):
                    return payload
            except Exception:
                continue
        raise HTTPException(status_code=500, detail=f"Failed to generate question {qnum}")

    # Generate all 10 questions concurrently
    questions = await asyncio.gather(*[generate_question(i) for i in range(1, 11)])
    return {"test_id": test_id, "questions": questions}

# --- Root Endpoint ---
@app.get("/")
def root():
    return {"message": "API is running. Endpoints: /upload-pdf, /flashcard/, /test/{id}"}
