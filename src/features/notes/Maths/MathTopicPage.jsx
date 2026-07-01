// pages/MathTopicPage.jsx
// ─────────────────────────────────────────────────────────
// Root page component for MATH topics (Percentage, Discount,
// Profit & Loss, ...). Same shell pattern as GKTopicPage, but
// tabs + sub-components are built for CONCEPT UNDERSTANDING,
// not plain reading — step-flows, accordions, reveal-solution
// practice cards, color-coded difficulty & callouts.
//
// Props:
//   data — Math JSON object (topic, introduction, concepts,
//          formulas, question_types, identification_tricks,
//          solving_approach, shortcuts, common_mistakes,
//          pyq_patterns, quick_revision, exam_tips,
//          one_page_formula_sheet)
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../../theme/Theme.jsx";
import ConceptsTab      from "../../../component/math/ConceptsTab.jsx";
import QuestionTypesTab from "../../../component/math/QuestionTypesTab.jsx";
import FormulaSheetTab  from "../../../component/math/FormulaSheetTab.jsx";
import QuickRevisionTab from "../../../component/math/QuickRevisionTab.jsx";
import ComingSoonPanel  from "../../../component/math/ComingSoonPanel.jsx";

const TABS = [
  { key: "concepts", label: "Concepts"      },
  { key: "types",    label: "Question Types" },
  { key: "formula",  label: "Formula Sheet"  },
  { key: "revision", label: "Quick Revision" },
  { key: "pyq",      label: "PYQ Patterns"   },
  { key: "mindmap",  label: "Mind Map"       },
];

const COMING_SOON = {
  mindmap: { icon: "🧠", title: "Mind Map", desc: "Visual concept map for this chapter — coming soon." },
};

export default function MathTopicPage({ data }) {
  const [activeTab, setActiveTab] = useState("concepts");

  const solved = typeof window !== "undefined"
    ? Number(localStorage.getItem(`math_progress_${data?.topic}`) || 0)
    : 0;
  const totalQ = (data?.question_types || []).reduce(
    (sum, qt) => sum + (qt.practice_questions?.length || 0), 0
  );

  return (
    <div style={{ background: palette.ink, minHeight: "100vh" }}>
      {/* ── STICKY HEADER ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: palette.ink,
          borderBottom: `1px solid ${palette.border}`,
          boxShadow: `0 0 40px ${palette.goldGlow}`,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "auto", padding: "20px 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1
                style={{
                  color: palette.gold,
                  fontSize: "clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem)",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                ∑ {data?.topic}
              </h1>
              <p
                style={{
                  color: palette.muted,
                  fontSize: "clamp(0.875rem, 0.8rem + 0.35vw, 1rem)",
                  marginTop: 6,
                  marginBottom: 0,
                  maxWidth: 720,
                }}
              >
                {data?.introduction}
              </p>
            </div>

            {totalQ > 0 && (
              <div
                style={{
                  border: `1px solid ${palette.border}`,
                  borderRadius: 12,
                  padding: "8px 14px",
                  background: palette.navy,
                  color: palette.muted,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                ✅ {solved}/{totalQ} practiced
              </div>
            )}
          </div>

          <nav
            role="tablist"
            aria-label="Math topic tabs"
            style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2, marginTop: 18 }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    border: `1px solid ${active ? palette.goldBorder : palette.border}`,
                    background: active ? palette.goldSoft : palette.navy,
                    color: active ? palette.gold : palette.muted,
                    padding: "8px 18px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "clamp(0.875rem, 0.8rem + 0.35vw, 1rem)",
                    whiteSpace: "nowrap",
                    transition: "all 0.18s ease",
                    boxShadow: active ? `0 0 0 1px ${palette.goldBorder}` : "none",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── TAB CONTENT ── */}
      <main style={{ maxWidth: "1400px", margin: "auto", padding: "24px" }}>
        {activeTab === "concepts" && <ConceptsTab data={data} />}
        {activeTab === "types"    && <QuestionTypesTab data={data} />}
        {activeTab === "formula"  && <FormulaSheetTab data={data} />}
        {activeTab === "revision" && <QuickRevisionTab data={data} />}
        {activeTab === "pyq"      && (
          <PatternsPanel data={data} />
        )}
        {COMING_SOON[activeTab] && <ComingSoonPanel {...COMING_SOON[activeTab]} />}
      </main>
    </div>
  );
}

function PatternsPanel({ data }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <SectionCard title="🎯 PYQ Patterns & Exam Observations">
        <ul style={{ margin: 0, paddingLeft: 20, color: palette.muted, lineHeight: 1.8 }}>
          {(data?.pyq_patterns || []).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </SectionCard>
      <SectionCard title="🧭 Exam Tips">
        <ul style={{ margin: 0, paddingLeft: 20, color: palette.muted, lineHeight: 1.8 }}>
          {(data?.exam_tips || []).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </SectionCard>
    </div>
  );
}

export function SectionCard({ title, children, accent }) {
  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        background: palette.navy,
        padding: 20,
        borderLeft: accent ? `4px solid ${accent}` : `1px solid ${palette.border}`,
      }}
    >
      <h3 style={{ color: palette.gold, fontSize: "1.1rem", margin: "0 0 12px" }}>{title}</h3>
      {children}
    </section>
  );
}
