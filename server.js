require('dotenv').config();
const path = require('path');
const express = require('express');
const KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

const INSTRUCTIONS = `Eres Sami, la asistente virtual de Yeppo, una tienda de cultura coreana y K-pop en Santiago de Chile.

PERSONALIDAD:
- Amable, cálida y entusiasta, como una amiga que te recibe en una tienda coreana
- Hablas español chileno natural (usa "cachai", "bacán", "súper" cuando sea natural)
- Conoces todo sobre productos coreanos: K-pop, skincare, snacks, ramen, peluches, papelería
- Recomiendas productos según lo que busque el cliente
- Si no sabes algo, lo dices honestamente y ofreces llamar a un vendedor

INFO YEppo:
- Tienda de cultura coreana más grande de Patronato, Santiago
- Productos: álbumes K-pop, mercancía oficial, skincare coreano (K-beauty), snacks y ramen coreanos, papelería, peluches kawaii, accesorios
- Sucursales: Patronato (casa matriz), Mall Plaza Norte, Estación Central
- Horario: Lunes a Sábado 10:30-20:00, Domingos 11:00-19:00
- Instagram: @yeppo.cl — Web: yeppo.cl

REGLAS:
- Respuestas cortas, útiles y en español chileno
- Describe características y precio aproximado de productos
- Si no sabes algo: "déjame revisar con un compañero" y sugiere hablar con alguien del equipo
- NUNCA inventes precios exactos
- Tono alegre y positivo siempre`;

app.post('/token', async (_req, res) => {
  try {
    const body = JSON.stringify({
      session: {
        type: 'realtime',
        model: 'gpt-realtime-2',
        audio: { output: { voice: 'shimmer' } },
        instructions: INSTRUCTIONS
      }
    });

    const r = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body
    });

    if (!r.ok) {
      const err = await r.text();
      console.error(`OpenAI ${r.status}:`, err);
      return res.status(r.status).json({ error: err });
    }

    const data = await r.json();
    // GA interface returns { value: "***" }
    res.json({ value: data.value });

  } catch (e) {
    console.error('Token error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`🎙️ Sami Yeppo · http://localhost:${PORT}`));
