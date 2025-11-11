const API_BASE = "http://127.0.0.1:8000";

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload PDF");
  }

  return response.json();
}

export async function getTest(testId: number) {
  const response = await fetch(`${API_BASE}/test/${testId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch test");
  }

  return response.json();
}

export async function getFlashcard() {
  const response = await fetch(`${API_BASE}/flashcard/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch flashcard");
  }

  return response.json();
}
