import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE_SCRIPT = `# CHEAT SHEET: Llamada de Admision (LOFI LAB)

## 1. QUIMICA / Rapport
- Hola [Nombre], ¿De dónde eres? ¿Cómo va la mañana/tarde/noche?
- ¿Qué tal la semana, mucho lío en el trabajo?
- Por curiosidad, ¿cómo nos conociste o llegaste a nosotros?

## 2. EL ENCUADRE / Calibracion
- Esta es una llamada de admisión para ver si cualificas para entrar en nuestra formacion.
- Te haré unas preguntas sobre tu situación actual y tus objetivos a 6-12 meses.
- Si vemos que te puedo ayudar y encajamos, te cuento cómo funciona todo. Si no, te lo diré con total honestidad.
- Antes de empezar... ¿Pudiste ver el vídeo de YouTube que te mandé?

## 3. DIAGNOSTICO y Bifurcacion
- Vi que haces [Género], llevas [X tiempo] produciendo.
- ¿cuál es tu objetivo principal? ¿Ingresos o realización personal?

## 4. PUNTOS DE DOLOR
- ¿Hace cuánto tiempo que intentas arrancar esto en serio sin ver resultados?
- ¿Qué es lo que más te frustra a día de hoy?
- Micro-cierre: Si te mostrara una ruta validada, ¿estarías dispuesto a aplicarlo en serio?

## 5. PANEL VISIONARIO
- A 6-12 meses... ¿Dónde te gustaría que estuviera tu proyecto?
- ¿Qué significaría eso para ti a nivel personal?

## 6. RESUMEN + VALIDACIÓN
- ¿Esto es hobby o quieres convertirlo en algo serio?
- ¿Estarías dispuesto a hacer lo necesario?
- ¿Tomas tú este tipo de decisiones o lo habláis con tu pareja?

## 7. LA PRESENTACIÓN
- "No te enseñamos a hacer música... te enseñamos a convertir lo que ya haces en un sistema que genere ingresos."
- "Cogemos tus temas y te enseñamos a estructurarlos, publicarlos y moverlos para que entren en playlists."
- "Sistema paso a paso, acompañamiento y comunidad de productores."
- "Objetivo: proyecto que genere mínimo 1000€/mes."

## 8. EL PRECIO Y EL CIERRE
- Precio normal: 1750€
- Decisión en llamada: 1400€
- "Si hoy me dices que sí, entras por 1400€. Si cierras el Zoom y escribes mañana, son 1750€."
- SILENCIO TOTAL. EL PRIMERO QUE HABLA, PIERDE`;

export async function POST(request) {
  try {
    const { conversation } = await request.json();
    if (!conversation?.trim()) {
      return Response.json({ error: "Conversación vacía" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: `Eres experto en ventas de alto ticket para Lofi Lab. Analiza la conversación del setter y genera un script personalizado para el closer. Responde SOLO con JSON válido, sin backticks ni texto extra. Estructura exacta:
{"prospecto":{"nombre":"string","genero":"string","experiencia":"string","situacion":"string en 1 frase","objetivo":"monetizar/personal/ambos","motivacion_principal":"string","objeciones_probables":["string","string"],"nivel_urgencia":"alta/media/baja","tono":"string"},"puntos_clave":["string x5"],"alertas":["string x2"],"script":{"rapport":"frase apertura personalizada","encuadre":"encuadre adaptado","diagnostico":"pregunta diagnóstico personalizada","dolor":"pregunta dolor personalizada","micro_cierre_dolor":"micro-cierre personalizado","vision":"pregunta visión personalizada","resumen_validacion":"resumen con sus palabras","manejo_objeciones":"manejo objeción principal","pitch_precio":"pitch precio adaptado","cierre_final":"frase cierre personalizada"}}`,
      messages: [
        {
          role: "user",
          content: `Script base:\n\n${BASE_SCRIPT}\n\n---\n\nConversación del setter:\n\n${conversation}\n\nGenera el JSON.`,
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