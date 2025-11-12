
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.warn("GEMINI_API_KEY not found. Please set it in your .env file.");
}
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/api/summary', async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: "API key not configured on the server." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const data = req.body.data;

        const prompt = `
            Analyze the following digital footprint data and provide a concise, user-friendly summary.
            Explain what this data reveals about the user in simple terms.
            Focus on privacy implications and offer one key actionable tip for better privacy.
            Data: ${JSON.stringify(data, null, 2)}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.json({ summary: text });

    } catch (error) {
        console.error("Error in /api/summary:", error);
        res.status(500).json({ error: "Failed to generate AI summary." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
