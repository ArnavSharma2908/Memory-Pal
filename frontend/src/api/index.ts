// Dynamically resolve API base: try localhost first, then fallback to the EC2 public IP.
// Cache the result in localStorage so probes run only once per browser.
const CANDIDATE_BASES = [
  "http://127.0.0.1:8000",
  "http://43.204.227.202:8000",
  "http://43.204.227.202",
];

let _basePromise: Promise<string> | null = null;
async function resolveApiBase(): Promise<string> {
  const cached = localStorage.getItem("API_BASE");
  if (cached) return cached;

  for (const candidate of CANDIDATE_BASES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      // try a lightweight request - if it resolves we consider the endpoint reachable
      await fetch(candidate + "/", { method: "GET", signal: controller.signal, cache: "no-store" });
      clearTimeout(timeout);
      localStorage.setItem("API_BASE", candidate);
      return candidate;
    } catch (e) {
      // probe failed, try next
    }
  }

  // fallback to the public EC2 IP if none responded
  const fallback = CANDIDATE_BASES[1];
  localStorage.setItem("API_BASE", fallback);
  return fallback;
}

function getApiBase(): Promise<string> {
  if (!_basePromise) _basePromise = resolveApiBase();
  return _basePromise;
}

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const API_BASE = await getApiBase();
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
  const API_BASE = await getApiBase();
  const response = await fetch(`${API_BASE}/test/${testId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch test");
  }

  return response.json();
}

export async function getFlashcard() {
  const API_BASE = await getApiBase();
  const response = await fetch(`${API_BASE}/flashcard/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch flashcard");
  }

  return response.json();
}
