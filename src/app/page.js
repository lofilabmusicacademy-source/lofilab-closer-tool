"use client";
import { useState, useRef } from "react";

const SECTIONS = [
  { id: "rapport", label: "1. Rapport", color: "#4ade80" },
  { id: "encuadre", label: "2. Encuadre", color: "#60a5fa" },
  { id: "diagnostico", label: "3. Diagnóstico", color: "#f59e0b" },
  { id: "dolor", label: "4. Dolor", color: "#f87171" },
  { id: "vision", label: "5. Visión", color: "#a78bfa" },
  { id: "resumen_validacion", label: "6. Resumen", color: "#34d399" },
  { id: "manejo_objeciones", label: "7. Objeciones", color: "#38bdf8" },
  { id: "pitch_precio", label: "8. Precio", color: "#fb923c" },
  { id: "cierre_final", label: "9. Cierre", color: "#e879f9" },
];

export default function Home() {
  const [conversation, setConversation] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const analyze = async () => {
    if (!conversation.trim()) {
      setError("Pega la conversación de WhatsApp antes de continuar.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      console.error(e);
      setError("⚠️ Error al analizar. Asegúrate de pegar el chat completo del setter con el prospecto.");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!result) return;
    const s = result.script;
    const text = `SCRIPT — ${result.prospecto?.nombre?.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. RAPPORT
${s.rapport}

2. ENCUADRE
${s.encuadre}

3. DIAGNÓSTICO
${s.diagnostico}

4. DOLOR
${s.dolor}
→ Micro-cierre: ${s.micro_cierre_dolor}

5. VISIÓN
${s.vision}

6. RESUMEN + VALIDACIÓN
${s.resumen_validacion}

7. OBJECIONES
${s.manejo_objeciones}

8. PRECIO
${s.pitch_precio}

9. CIERRE
${s.cierre_final}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urgencyColor = (u) =>
    u === "alta" ? "#4ade80" : u === "media" ? "#f59e0b" : "#f87171";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8e8", fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #4ade80, #60a5fa)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎧</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#4ade80", textTransform: "uppercase" }}>Lofi Lab</div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>CLOSER PREP TOOL v1.0</div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.15em", color: "#4ade80", marginBottom: 12, textTransform: "uppercase" }}>
            Conversación del Setter (WhatsApp)
          </label>
          <textarea
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder={"Pega aquí el chat completo de WhatsApp del setter con el prospecto..."}
            style={{
              width: "100%", minHeight: 220, background: "#0f0f1a", border: "1px solid #1e1e2e",
              borderRadius: 8, padding: 16, color: "#e8e8e8", fontSize: 13, lineHeight: 1.7,
              resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4ade80")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
          />
          {error && <div style={{ color: "#f87171", fontSize: 12, marginTop: 8 }}>{error}</div>}
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              marginTop: 16, padding: "12px 32px",
              background: loading ? "#1e1e2e" : "linear-gradient(135deg, #4ade80, #60a5fa)",
              border: "none", borderRadius: 6, color: loading ? "#555" : "#0a0a0f",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}
          >
            {loading ? "⟳  Analizando..." : "→  Generar Script Personalizado"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Procesando conversación...</div>
          </div>
        )}

        {result && (
          <div ref={resultRef}>
            <div style={{ background: "#0f0f1a", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Prospecto</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{result.prospecto?.nombre}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: result.prospecto?.genero, color: "#60a5fa" },
                    { label: result.prospecto?.experiencia, color: "#a78bfa" },
                    { label: `Urgencia ${result.prospecto?.nivel_urgencia}`, color: urgencyColor(result.prospecto?.nivel_urgencia) },
                  ].map((tag, i) => (
                    <span key={i} style={{ background: "#1e1e2e", border: `1px solid ${tag.color}44`, borderRadius: 4, padding: "4px 10px", fontSize: 11, color: tag.color }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "#0a0a0f", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Situación</div>
                  <div style={{ fontSize: 13, color: "#c0c0d0", lineHeight: 1.6 }}>{result.prospecto?.situacion}</div>
                </div>
                <div style={{ background: "#0a0a0f", borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Motivación principal</div>
                  <div style={{ fontSize: 13, color: "#c0c0d0", lineHeight: 1.6 }}>{result.prospecto?.motivacion_principal}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Puntos clave</div>
                  {result.puntos_clave?.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "#4ade80", fontSize: 10, marginTop: 3 }}>▸</span>
                      <span style={{ fontSize: 12, color: "#b0b0c0", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#f87171", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>⚠ Alertas</div>
                  {result.alertas?.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "#f87171", fontSize: 10, marginTop: 3 }}>▸</span>
                      <span style={{ fontSize: 12, color: "#b0b0c0", lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Objeciones probables</div>
                    {result.prospecto?.objeciones_probables?.map((o, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: "#f59e0b", fontSize: 10, marginTop: 3 }}>▸</span>
                        <span style={{ fontSize: 12, color: "#b0b0c0", lineHeight: 1.5 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase" }}>Script Personalizado</div>
              <button
                onClick={copyScript}
                style={{
                  padding: "8px 20px", background: copied ? "#4ade8022" : "#1e1e2e",
                  border: `1px solid ${copied ? "#4ade80" : "#2a2a3e"}`, borderRadius: 6,
                  color: copied ? "#4ade80" : "#888", fontSize: 11, cursor: "pointer",
                  fontFamily: "inherit", letterSpacing: "0.1em",
                }}
              >
                {copied ? "✓ Copiado" : "Copiar todo"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTIONS.map((sec) => {
                const rawContent = sec.id === "dolor"
                  ? `${result.script?.dolor}\n\n→ Micro-cierre: ${result.script?.micro_cierre_dolor}`
                  : result.script?.[sec.id];
                if (!rawContent) return null;
                const isOpen = activeSection === sec.id;
                return (
                  <div key={sec.id} style={{ background: "#0f0f1a", border: `1px solid ${isOpen ? sec.color + "44" : "#1e1e2e"}`, borderRadius: 8, overflow: "hidden" }}>
                    <button
                      onClick={() => setActiveSection(isOpen ? null : sec.id)}
                      style={{ width: "100%", padding: "14px 20px", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: sec.color }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: isOpen ? sec.color : "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>{sec.label}</span>
                      </div>
                      <span style={{ color: "#555", fontSize: 14 }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${sec.color}22` }}>
                        <div style={{ marginTop: 14, fontSize: 13, color: "#d0d0e0", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{rawContent}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}