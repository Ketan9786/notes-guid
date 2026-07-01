// component/math/FormulaSheetTab.jsx
// ─────────────────────────────────────────────────────────
// One-page formula sheet — designed for a 60-second scan
// right before the exam. Renders `formulas` (full list) as
// a numbered grid, and `one_page_formula_sheet` (condensed
// key:value map) as bold quick-reference tiles. Includes a
// "Copy all" button for quick pasting into own notes.
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../theme/Theme.jsx";

export default function FormulaSheetTab({ data }) {
  const formulas = data?.formulas || [];
  const sheet = data?.one_page_formula_sheet || {};
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = formulas.join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Condensed one-page tiles */}
      <section
        style={{
          border: `1px solid ${palette.goldBorder}`,
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.01))",
          padding: 20,
        }}
      >
        <h3 style={{ color: palette.gold, fontSize: "1.15rem", margin: "0 0 14px" }}>
          📐 One-Page Formula Sheet — {data?.topic}
        </h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {Object.entries(sheet).map(([key, val]) => (
            <FormulaTile key={key} label={humanize(key)} value={val} />
          ))}
        </div>
      </section>

      {/* Full formula list */}
      <section style={{ border: `1px solid ${palette.border}`, borderRadius: 16, background: palette.navy, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ color: palette.gold, fontSize: "1.05rem", margin: 0 }}>📋 All Formulas</h3>
          <button
            onClick={handleCopy}
            style={{
              border: `1px solid ${palette.goldBorder}`,
              background: "transparent",
              color: palette.gold,
              padding: "6px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy all"}
          </button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {formulas.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                border: `1px solid ${palette.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.02)",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
            >
              <span style={{ color: palette.gold, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ color: "#e5e5e5" }}>{f}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FormulaTile({ label, value }) {
  // value can be a string OR a nested object (e.g. fraction table)
  const isObject = value && typeof value === "object";
  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        background: "rgba(0,0,0,0.15)",
      }}
    >
      <p style={{ color: palette.muted, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
        {label}
      </p>
      {isObject ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px,1fr))", gap: 6 }}>
          {Object.entries(value).map(([k, v]) => (
            <div key={k} style={{ textAlign: "center", background: "rgba(212,175,55,0.06)", borderRadius: 8, padding: "4px 2px" }}>
              <div style={{ color: palette.gold, fontSize: "0.72rem", fontWeight: 700 }}>{k}</div>
              <div style={{ color: "#e5e5e5", fontSize: "0.68rem" }}>{v}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#f0e4bd", fontSize: "0.9rem", fontWeight: 700, margin: 0, fontFamily: "monospace" }}>{value}</p>
      )}
    </div>
  );
}

function humanize(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
