import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Use the correct Gemini API scope
const GEMINI_SCOPES = ['https://www.googleapis.com/auth/generative-language'];
// Try the more widely available model name
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

const CREDENTIALS_PATH = path.join(__dirname, '../../gemini-service-account.json');

let credentials: any = null;
if (fs.existsSync(CREDENTIALS_PATH)) {
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} else {
  throw new Error('Gemini service account credentials not found.');
}

const auth = new GoogleAuth({
  credentials,
  scopes: GEMINI_SCOPES,
});

type GeminiResponse = { candidates?: { content: { parts: { text: string }[] } }[] };

export async function geminiChat(prompt: string): Promise<string> {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = await axios.post(
    GEMINI_API_URL,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const candidates = (response.data as GeminiResponse).candidates;
  if (candidates && candidates.length > 0) {
    return candidates[0].content.parts[0].text;
  }
  return '[No response from Gemini]';
} 