const API_URL = "http://localhost:5000";

export async function analyzeShelfImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_URL}/api/vision/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

export async function classifyProduct(detectionId) {
  return null;
}

export async function getAnalysisHistory() {
  return [];
}