// component/math/QuestionTypesTab.jsx
// ─────────────────────────────────────────────────────────
// The CORE learning component. Each SSC CGL question type is
// rendered as an expandable "Type Card" containing:
//   - Difficulty badge + expected time chip
//   - Identification method / When to use (highlighted box)
//   - Step-by-step solving approach (staircase)
//   - Shortcut (gold callout)
//   - Common mistakes (red callout)
//   - Practice questions with a "Reveal Solution" flip —
//     forces active recall instead of passive reading.
// A left-side type selector list lets the student jump
// straight to the question type they find difficult.
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../theme/Theme.jsx";

const DIFFICULTY_COLOR = {
  "Easy": "#5fbf7a",
  "Easy-Medium": "#9fbf5f",
  "Medium": "#d4af37",
  "Medium-Hard": "#e08a3c",
  "Hard": "#e05a5a",
};

function difficultyColor(level = "") {
  return DIFFICULTY_COLOR[level] || palette.gold;
}

export default function QuestionTypesTab({ data }) {
  const types = data?.question_types || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = types[activeIdx];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "flex-start" }}>
      {/* ── LEFT: Type selector ── */}
      <aside
        style={{
          border: `1px solid ${palette.border}`,
          borderRadius: 16,
          background: palette.navy,
          padding: 12,
          position: "sticky",
          top: 140,
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
        }}
      >
        <p style={{ color: palette.muted, fontSize: "0.78rem", margin: "4px 8px 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>
          🧩 {types.length} Question Types
        </p>
        {types.map((t, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "none",
                background: isActive ? palette.goldSoft : "transparent",
                color: isActive ? palette.gold : "#c9c9c9",
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                marginBottom: 4,
                lineHeight: 1.4,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: difficultyColor(t.difficulty),
                  marginRight: 8,
                }}
              />
              {t.type_name}
            </button>
          );
        })}
      </aside>

      {/* ── RIGHT: Active type detail ── */}
      {active ? <TypeCard type={active} /> : <p style={{ color: palette.muted }}>No question types found.</p>}
    </div>
  );
}

function TypeCard({ type }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Header row */}
      <div
        style={{
          border: `1px solid ${palette.border}`,
          borderRadius: 16,
          background: palette.navy,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <h2 style={{ color: palette.gold, fontSize: "1.3rem", margin: 0 }}>{type.type_name}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge color={difficultyColor(type.difficulty)}>{type.difficulty}</Badge>
            {type.expected_time_seconds && (
              <Badge color={palette.muted}>⏱ {type.expected_time_seconds}s target</Badge>
            )}
          </div>
        </div>

        {/* Identification + When to use */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <InfoBox icon="🔍" label="How to Identify" text={type.identification_method} />
          <InfoBox icon="🎯" label="When to Use This Method" text={type.when_to_use} />
        </div>
      </div>

      {/* Step-by-step */}
      <section style={{ border: `1px solid ${palette.border}`, borderRadius: 16, background: palette.navy, padding: 20 }}>
        <h3 style={{ color: palette.gold, fontSize: "1.05rem", margin: "0 0 14px" }}>🪜 Step-by-Step Approach</h3>
        <div>
          {(type.step_by_step || []).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: palette.goldSoft, border: `2px solid ${palette.goldBorder}`,
                    color: palette.gold, display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.75rem", flexShrink: 0,
                  }}
                >{i + 1}</div>
                {i < (type.step_by_step.length - 1) && <div style={{ width: 2, flex: 1, background: palette.border, minHeight: 18 }} />}
              </div>
              <p style={{ color: "#e5e5e5", fontSize: "0.9rem", lineHeight: 1.6, paddingBottom: 16 }}>{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shortcut + Mistakes side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {type.shortcut && (
          <div style={{ border: `1px solid ${palette.goldBorder}`, borderRadius: 14, background: "rgba(212,175,55,0.06)", padding: 16 }}>
            <h4 style={{ color: palette.gold, margin: "0 0 8px", fontSize: "0.95rem" }}>⚡ Shortcut</h4>
            <p style={{ color: "#f0e4bd", fontSize: "0.87rem", lineHeight: 1.6, margin: 0 }}>{type.shortcut}</p>
          </div>
        )}
        {type.common_mistakes?.length > 0 && (
          <div style={{ border: `1px solid rgba(220,80,80,0.35)`, borderRadius: 14, background: "rgba(220,80,80,0.05)", padding: 16 }}>
            <h4 style={{ color: "#e07a7a", margin: "0 0 8px", fontSize: "0.95rem" }}>⚠️ Common Mistakes</h4>
            <div style={{ display: "grid", gap: 6 }}>
              {type.common_mistakes.map((m, i) => (
                <p key={i} style={{ color: "#e5c9c9", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>❌ {m}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Practice questions with reveal-solution */}
      <section style={{ border: `1px solid ${palette.border}`, borderRadius: 16, background: palette.navy, padding: 20 }}>
        <h3 style={{ color: palette.gold, fontSize: "1.05rem", margin: "0 0 4px" }}>✍️ Practice Questions</h3>
        <p style={{ color: palette.muted, fontSize: "0.82rem", margin: "0 0 16px" }}>
          Try solving mentally first, then tap "Reveal Solution" to check.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {(type.practice_questions || []).map((pq, i) => (
            <PracticeCard key={i} index={i} pq={pq} />
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoBox({ icon, label, text }) {
  return (
    <div style={{ border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.02)" }}>
      <p style={{ color: palette.muted, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>
        {icon} {label}
      </p>
      <p style={{ color: "#e5e5e5", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span
      style={{
        border: `1px solid ${color}`,
        color,
        fontSize: "0.75rem",
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 20,
        background: `${color}1a`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function PracticeCard({ index, pq }) {
  const [revealed, setRevealed] = useState(false);
  const question = pq.q || pq.question;
  const solution = pq.solution;
  const answer = pq.answer;

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: 16,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        <span
          style={{
            flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
            background: palette.goldSoft, color: palette.gold, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700,
            border: `1px solid ${palette.goldBorder}`,
          }}
        >
          Q{index + 1}
        </span>
        <p style={{ color: "#e5e5e5", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{question}</p>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          style={{
            marginTop: 12,
            marginLeft: 36,
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
          👁 Reveal Solution
        </button>
      ) : (
        <div
          style={{
            marginTop: 12,
            marginLeft: 36,
            borderLeft: `3px solid ${palette.goldBorder}`,
            paddingLeft: 14,
          }}
        >
          <p style={{ color: palette.muted, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px" }}>
            Solution
          </p>
          <p style={{ color: "#f0e4bd", fontSize: "0.87rem", lineHeight: 1.6, margin: "0 0 8px", fontFamily: "monospace" }}>
            {solution}
          </p>
          <p style={{ color: palette.gold, fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>
            ✅ Answer: {answer}
          </p>
          <button
            onClick={() => setRevealed(false)}
            style={{
              marginTop: 10, border: "none", background: "transparent",
              color: palette.muted, fontSize: "0.75rem", cursor: "pointer", padding: 0,
              textDecoration: "underline",
            }}
          >
            Hide solution
          </button>
        </div>
      )}
    </div>
  );
}
