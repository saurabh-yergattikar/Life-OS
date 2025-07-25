"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiChat = geminiChat;
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Use the correct Gemini API scope
const GEMINI_SCOPES = ['https://www.googleapis.com/auth/generative-language'];
// Try the more widely available model name
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
const CREDENTIALS_PATH = path_1.default.join(__dirname, '../../gemini-service-account.json');
let credentials = null;
if (fs_1.default.existsSync(CREDENTIALS_PATH)) {
    credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, 'utf8'));
}
else {
    throw new Error('Gemini service account credentials not found.');
}
const auth = new google_auth_library_1.GoogleAuth({
    credentials,
    scopes: GEMINI_SCOPES,
});
async function geminiChat(prompt) {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
    };
    const response = await axios_1.default.post(GEMINI_API_URL, body, {
        headers: {
            Authorization: `Bearer ${accessToken.token}`,
            'Content-Type': 'application/json',
        },
    });
    const candidates = response.data.candidates;
    if (candidates && candidates.length > 0) {
        return candidates[0].content.parts[0].text;
    }
    return '[No response from Gemini]';
}
