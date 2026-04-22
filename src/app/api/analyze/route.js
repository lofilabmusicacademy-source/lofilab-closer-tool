import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { conversation } = await request.json();
    if (!conversation?.trim()) {
      return Response.json({ error: "Conversacion vacia" }, { status: 400 });
    }

    const clean_conv = conversation.replace(/`/g, "'").replace(/\\/g, " ");

    const prompt = "Analiza esta conversacion de WhatsApp de un setter de Lofi Lab con un prospecto y genera un script personalizado para el closer.\n\nCONVERSACION:\n" + clean_conv + "\n\nResponde SOLO con este JSON exacto, sin texto extra ni backticks:\n{\"prospecto\":{\"nombre\":\"nombre\",\"genero\":\"genero musical\",\"experiencia\":\"tiempo produciendo\",\"situacion\":\"situacion en 1 frase\",\"objetivo\":\"monetizar/personal/ambos\",\"motivacion\":\"motivacion principal\",\"objeciones\":[\"objecion 1\",\"objecion 2\"],\"urgencia\":\"alta/media/baja\",\"tono\":\"tono de comunicacion\"},\"puntos_clave\":[\"punto 1\",\"punto 2\",\"punto 3\"],\"alertas\":[\"alerta 1\",\"alerta 2\"],\"script\":{\"rapport\":\"frase apertura\",\"diagnostico\":\"pregunta diagnostico\",\"dolor\":\"pregunta frustracion\",\"vision\":\"pregunta objetivo ideal\",\"objecion\":\"manejo objecion principal\",\"cierre\":\"frase cierre personalizada\"}}";

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.map((b) => b.text || "").join("");
    const cleaned = text.replace(/```json[\s\S]*?```|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }
    if (!parsed) return Response.json({ error: "No se pudo parsear" }, { status: 500 });
    return Response.json(parsed);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}