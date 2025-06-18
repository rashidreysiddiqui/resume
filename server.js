
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'OpenAI API error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
