// Client API utility for Daily Brief
const BACKEND_URL = "http://localhost:4000";

export async function getNightAgentResults() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/night-agent/report`);
    if (!res.ok) {
      // If no report exists, get current progress
      const progressRes = await fetch(`${BACKEND_URL}/api/night-agent/progress`);
      if (progressRes.ok) {
        return await progressRes.json();
      }
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching Night Agent results:', error);
    return null;
  }
}

export async function getNightAgentProgress() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/night-agent/progress`);
    return res.json();
  } catch (error) {
    console.error('Error fetching Night Agent progress:', error);
    return null;
  }
} 