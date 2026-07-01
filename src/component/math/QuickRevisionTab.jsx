// component/math/QuickRevisionTab.jsx
// ─────────────────────────────────────────────────────────
// Last-minute revision tab — quick_revision bullets rendered
// as flashcards the student can flip through fast (like
// swiping revision cards night before exam), plus a compact
// "identification cheat list" pulled from identification_tricks
// for rapid-fire pattern recall.
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../theme/Theme.jsx";

export default function QuickRevisionTab({ data }) {
  const points = data?.quick_revision || [];
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => (i + 1) % points.length);
  const prev = () => setIdx((i) => (i - 1 + points.length) % points.length);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Flashcard swiper */}
      <section
        style={{
          border: `1px solid ${palette.goldBorder}`,
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.01))",
          padding: "32px 24px",
          textAlign: "center",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: palette.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          ⚡ Quick Revision Card {points.length ? `${idx + 1}/${points.length}` : ""}
        </p>
        <p style={{ color: palette.gold, fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.5, fontFamily: "monospace", maxWidth: 640 }}>
          {points[idx]}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <NavBtn onClick={prev}>← Prev</NavBtn>
          <NavBtn onClick={next}>Next →</NavBtn>
        </div>
      </section>

      {/* All points list for scanning */}
      <section style={{ border: `1px solid ${palette.border}`, borderRadius: 16, background: palette.navy, padding: 20 }}>
        <h3 style={{ color: palette.gold, fontSize: "1.05rem", margin: "0 0 14px" }}>📝 All Quick Revision Points</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {points.map((p, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              style={{
                display: "flex",
                gap: 10,
                border: `1px solid ${i === idx ? palette.goldBorder : palette.border}`,
                borderRadius: 10,
                padding: "10px 14px",
                background: i === idx ? palette.goldSoft : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
            >
              <span style={{ color: palette.gold, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ color: "#e5e5e5" }}>{p}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NavBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${palette.goldBorder}`,
        background: "transparent",
        color: palette.gold,
        padding: "8px 18px",
        borderRadius: 10,
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}
