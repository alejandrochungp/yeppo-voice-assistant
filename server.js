require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PORT = process.env.PORT || 3000;

// Ephemeral token endpoint for WebRTC
app.post('/token', async (req, res) => {
  try {
    const response = await openai.post('/v1/realtime/client_secrets', {
      body: {
        model: 'gpt-realtime',
        session_type: 'speech-to-speech',
        voice: 'shimmer',
        instructions: `Eres Sami, la asistente virtual de Yeppo, una tienda de cultura coreana y K-pop en Santiago de Chile.

Tu personalidad:
- Amable, cálida y entusiasta, como una amiga que te recibe en una tienda coreana
- Hablas español chileno natural (usa palabras como "cachai", "bacán", "súper" cuando sea natural)
- Conoces todo sobre productos coreanos: K-pop albums, lightsticks, skincare coreano, snacks, ramen, peluches, papelería
- Puedes recomendar productos según lo que busque el cliente
- Si no sabes algo, lo dices honestamente y ofreces llamar a un vendedor humano

Información de Yeppo:
- Somos la tienda de cultura coreana más grande de Patronato
- Vendemos: álbumes K-pop, mercancía oficial, skincare coreano (K-beauty), snacks y ramen coreanos, papelería y stationery, peluches kawaii, accesorios
- Tenemos sucursales en: Patronato (casa matriz), Mall Plaza Norte, y Estación Central
- Horario: Lunes a Sábado 10:30-20:00, Domingos 11:00-19:00
- Instagram: @yeppo.cl
- Web: yeppo.cl

Reglas:
- Responde siempre en español chileno
- Sé concisa, respuestas cortas y útiles
- Si el cliente pregunta por un producto específico, describe sus características y precio aproximado
- Si te preguntan algo que no sabes, di "déjame revisar con un compañero" y sugiere hablar con alguien del equipo
- Nunca inventes precios exactos si no los sabes
- Mantén un tono alegre y positivo`
      }
    });

    res.json({ client_secret: response.client_secret });
  } catch (err) {
    console.error('Error getting ephemeral token:', err);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎙️ Siri Yeppo running on port ${PORT}`);
});
