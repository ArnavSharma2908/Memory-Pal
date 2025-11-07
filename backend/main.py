from fastapi import FastAPI, File, UploadFile, HTTPException
import random

app = FastAPI()

# --- Sample data ---
FLASHCARDS = [
    {"question": "What is AI?", "answer": "Artificial Intelligence"},
    {"question": "Define Machine Learning.", "answer": "A subset of AI that enables systems to learn from data."},
    {"question": "What is Deep Learning?", "answer": "A subfield of ML using neural networks with many layers."},
    {"question": "What is supervised learning?", "answer": "Learning using labeled data."},
    {"question": "What is unsupervised learning?", "answer": "Learning using unlabeled data."},
    {"question": "What is a neural network?", "answer": "A computational model inspired by the human brain."},
    {"question": "What is reinforcement learning?", "answer": "Learning based on rewards and punishments."},
    {"question": "What is computer vision?", "answer": "A field of AI that enables computers to interpret visual data."},
]

TESTS = {
    i: [
        {
            "question": f"Question {q} of Test {i}",
            "correct_answer": f"Answer {q}",
            "topic": random.choice(["AI", "ML", "DL", "Data Science", "Robotics"])
        }
        for q in range(1, 11)
    ]
    for i in range(1, 8)
}

# --- Upload PDF ---
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    content = await file.read()
    # (Optional) Save or process the file
    return {"filename": file.filename, "size": len(content), "message": "PDF uploaded successfully"}

# --- Get Random Flashcard ---
@app.get("/flashcard/")
async def get_random_flashcard():
    flashcard = random.choice(FLASHCARDS)
    return flashcard

# --- Get Test by ID ---
@app.get("/test/{test_id}")
async def get_test(test_id: int):
    if test_id not in TESTS:
        raise HTTPException(status_code=404, detail="Test not found (choose between 1–7)")
    return {"test_id": test_id, "questions": TESTS[test_id]}

# --- Root Endpoint ---
@app.get("/")
def root():
    return {"message": "API is running. Endpoints: /upload-pdf, /flashcard/, /test/{id}"}
