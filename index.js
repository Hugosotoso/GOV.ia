const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// 🚀 DESTRAVADOR DE CORS MANUAL (Sem precisar do package.json)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { mensagem, nome, cargo, uorg } = req.body;
        const promptContexto = `Aja como GOV.ia, um assistente virtual governamental. O utilizador é ${nome}, cargo ${cargo}, lotado em ${uorg}. Responda de forma curta e direta: "${mensagem}"`;

        const result = await model.generateContent(promptContexto);
        const response = await result.response;
        const texto = response.text();

        res.json({ resposta: texto });
    } catch (error) {
        console.error("ERRO DA IA:", error);
        // O SERVIDOR devolve o erro assim:
        res.status(500).json({ erro: "Erro na IA: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor GOV.ia a correr na porta ${PORT}`);
});
