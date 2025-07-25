"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geminiAgent_1 = require("../agent/geminiAgent");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt)
            return res.status(400).json({ error: 'Missing prompt' });
        const aiResponse = await (0, geminiAgent_1.geminiChat)(prompt);
        res.json({ response: aiResponse });
    }
    catch (err) {
        console.error('Gemini API error:', err);
        res.status(500).json({ error: 'Gemini API error', details: err.message });
    }
});
exports.default = router;
