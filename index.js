const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors()); // Libera o acesso para o teu app
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    const { mensagem, nome, cargo, uorg } = req.body;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Aja como GOV.ia. Usuário: ${nome}, Cargo: ${cargo}, Unidade: ${uorg}. Pergunta: ${mensagem}`;
        
       } catch (error) {
        console.error("ERRO DO GEMINI:", error);
        res.status(500).json({ erro: "Erro real da IA: " + error.message });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000!'));
