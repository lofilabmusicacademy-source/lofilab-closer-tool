import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { conversation } = await request.json();
    if (!conversation?.trim()) {
      return Response.json({ error: "Conversación vacía" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Analiza esta conversación de WhatsApp de un setter de Lofi Lab con un prospecto. Genera un script personalizado para el closer.

CONVERSACION:
${conversation.replace(/`/g, "'")}

Responde SOLO con este JSON exacto, sin texto extra ni backticks:
{"prospecto":{"nombre":"nombre","genero":"género musical","experiencia":"tiempo produciendo","situacion":"situación en 1 frase","objetivo":"monetizar/personal/ambos","motivacion":"motivación principal","objeciones":["objeción 1","objeción 2"],"urgencia":"alta/media/baja","tono":"tono de comunicación"},"puntos_clave":["punto 1","punto 2","punto 3"],"alertas":["alerta 1","alerta 2"],"script":{"rapport":"frase apertura","diagnostico":"pregunta diagnóstico","dolor":"pregunta frustración","vision":"pregunta objetivo ideal","objecion":"manejo objeción principal","cierre":"frase cierre personalizada"}}`,
CONVERSACIÓN:
${conversation}

Responde SOLO con este JSON exacto, sin texto extra ni backticks:
{"prospecto":{"nombre":"nombre","genero":"género musical","experiencia":"tiempo produciendo","situacion":"situación en 1 frase","objetivo":"monetizar/personal/ambos","motivacion":"motivación principal","objeciones":["objeción 1","objeción 2"],"urgencia":"alta/media/baja","tono":"tono de comunicación"},"puntos_clave":["punto 1","punto 2","punto 3"],"alertas":["alerta 1","alerta 2"],"script":{"rapport":"frase apertura personalizada","diagnostico":"pregunta diagnóstico","dolor":"pregunta sobre su frustración principal","vision":"pregunta sobre su objetivo ideal","objecion":"cómo manejar su objeción principal","cierre":"frase de cierre personalizada"}}`,
        },
      ],
    });

    const text = message.content.map((b) => b.text || "").join("");
    const clean = text.replace(/```json[\s\S]*?```|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }
    if (!parsed) return Response.json({ error: "No se pudo parsear" }, { status: 500 });
    return Response.json(parsed);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}