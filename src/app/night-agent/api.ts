// Client API utility for Night Agent page
const BACKEND_URL = "http://localhost:4000";

export async function startNightMode({ mode = "demo", tasks = ["wealth", "health", "career"], userId = "user123" } = {}) {
  const res = await fetch(`${BACKEND_URL}/api/night-agent/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, tasks, userId }),
  });
  return res.json();
}

export async function getNightProgress() {
  const res = await fetch(`${BACKEND_URL}/api/night-agent/progress`);
  return res.json();
}

export async function getMorningReport() {
  const res = await fetch(`${BACKEND_URL}/api/night-agent/report`);
  return res.json();
}

export async function resetNightAgent() {
  const res = await fetch(`${BACKEND_URL}/api/night-agent/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
} 