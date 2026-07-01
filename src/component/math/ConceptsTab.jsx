// component/math/ConceptsTab.jsx
// ─────────────────────────────────────────────────────────
// "Concepts" tab — built to TEACH, not just display text.
// Each concept becomes an expandable card with a plain-English
// explanation. Below that, an "Identification Tricks" panel
// (how to spot which method to use) rendered as quick-scan
// chips, and a "Solving Approach" numbered flow (like a
// staircase) so the student visually follows the steps.
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../theme/Theme.jsx";

export default function ConceptsTab({ data }) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <ConceptAccordion concepts={data?.concepts} />
      <IdentificationPanel tricks={data?.identification_tricks} />
      <SolvingStaircase steps={data?.solving_approach} />
      <ShortcutStrip shortcuts={data?.shortcuts} />
      <MistakeStrip mistakes={data?.common_mistakes} />
    </div>
  );
}

// ── 1. CONCEPT ACCORDION ─────────────────────────────────
function ConceptAccordion({ concepts = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        background: palette.navy,
        padding: 20,
      }}
    >
      <h3 style={{ color: palette.gold, fontSize: "1.15rem", margin: "0 0 4px" }}>
        💡 Concept Revision
      </h3>
      <p style={{ color: palette.muted, fontSize: "0.85rem", margin: "0 0 16px" }}>
        Tap each concept to understand it in plain language — not just read the formula.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {concepts.map((c, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                border: `1px solid ${isOpen ? palette.goldBorder : palette.border}`,
                borderRadius: 12,
                background: isOpen ? palette.goldSoft : "rgba(255,255,255,0.02)",
                padding: "14px 16px",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: isOpen ? palette.gold : "#e5e5e5", fontWeight: 600, fontSize: "0.95rem" }}>
                  {i + 1}. {c.concept}
                </span>
                <span style={{ color: palette.muted, fontSize: "0.85rem" }}>{isOpen ? "▲" : "▼"}</span>
              </div>
              {isOpen && (
                <p style={{ color: palette.muted, marginTop: 10, marginBottom: 0, lineHeight: 1.7, fontSize: "0.9rem" }}>
                  {c.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 2. IDENTIFICATION PANEL (how to spot the method) ────
function IdentificationPanel({ tricks = [] }) {
  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        background: palette.navy,
        padding: 20,
      }}
    >
      <h3 style={{ color: palette.gold, fontSize: "1.15rem", margin: "0 0 4px" }}>
        🔍 How to Identify Which Method to Use
      </h3>
      <p style={{ color: palette.muted, fontSize: "0.85rem", margin: "0 0 16px" }}>
        Scan the question for these trigger patterns before you start solving.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {tricks.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              border: `1px solid ${palette.border}`,
              borderRadius: 10,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: palette.goldSoft,
                color: palette.gold,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: `1px solid ${palette.goldBorder}`,
              }}
            >
              {i + 1}
            </span>
            <span style={{ color: "#e5e5e5", fontSize: "0.9rem", lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 3. SOLVING STAIRCASE (numbered step flow) ───────────
function SolvingStaircase({ steps = [] }) {
  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        background: palette.navy,
        padding: 20,
      }}
    >
      <h3 style={{ color: palette.gold, fontSize: "1.15rem", margin: "0 0 16px" }}>
        🪜 Step-by-Step General Approach
      </h3>
      <div style={{ display: "grid", gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: palette.goldSoft,
                  border: `2px solid ${palette.goldBorder}`,
                  color: palette.gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, background: palette.border, minHeight: 24 }} />
              )}
            </div>
            <p style={{ color: "#e5e5e5", fontSize: "0.92rem", lineHeight: 1.6, paddingBottom: 20 }}>
              {typeof s === "string" ? s.replace(/^Step \d+:\s*/, "") : s}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 4. SHORTCUT STRIP (horizontal scroll chips) ─────────
function ShortcutStrip({ shortcuts = [] }) {
  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.01))",
        padding: 20,
      }}
    >
      <h3 style={{ color: palette.gold, fontSize: "1.15rem", margin: "0 0 14px" }}>
        ⚡ Shortcuts & Memory Tricks
      </h3>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {shortcuts.map((s, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${palette.goldBorder}`,
              borderRadius: 10,
              padding: "12px 14px",
              background: "rgba(212,175,55,0.05)",
              color: "#f0e4bd",
              fontSize: "0.87rem",
              lineHeight: 1.5,
            }}
          >
            💡 {s}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 5. MISTAKE STRIP (warning callouts) ─────────────────
function MistakeStrip({ mistakes = [] }) {
  return (
    <section
      style={{
        border: `1px solid rgba(220,80,80,0.35)`,
        borderRadius: 16,
        background: "rgba(220,80,80,0.05)",
        padding: 20,
      }}
    >
      <h3 style={{ color: "#e07a7a", fontSize: "1.15rem", margin: "0 0 14px" }}>
        ⚠️ Common Mistakes to Avoid
      </h3>
      <div style={{ display: "grid", gap: 8 }}>
        {mistakes.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, color: "#e5c9c9", fontSize: "0.88rem", lineHeight: 1.6 }}>
            <span style={{ flexShrink: 0 }}>❌</span>
            <span>{m}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
