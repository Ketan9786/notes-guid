// pages/GKTopicPage.jsx
// ─────────────────────────────────────────────────────────
// Root page component.
// Props:
//   data  — GK JSON object (see schema in NotesTab.jsx)
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import palette from "../../theme/Theme.jsx";
import NotesTab    from "../../component/gk/NotesTab.jsx";
import RevisionTab from "../../component/gk/RevisionTab.jsx";
import ComingSoonPanel from "../../component/gk/ComingSoonPanel.jsx";


const TABS = [
  { key: "notes",    label: "📚 Notes"    },
  { key: "revision", label: "⚡ Revision"  },
  { key: "mindmap",  label: "🧠 Mind Map"  },
  { key: "pyq",      label: "🎯 PYQ Facts" },
  { key: "imp",      label: "🔥 IMP"       },
];

const COMING_SOON = {
  mindmap: { icon: "🧠", title: "Mind Map",    desc: "Visual concept maps for every chapter — coming soon." },
  pyq:     { icon: "🎯", title: "PYQ Facts",   desc: "Curated PYQ facts with exam-pattern analysis — coming soon." },
  imp:     { icon: "🔥", title: "IMP Points",  desc: "High-priority last-minute revision facts — coming soon." },
};

export default function GKTopicPage({ data }) {
  console.log("GKTopicPage data:", data);
  const [activeTab, setActiveTab] = useState("notes");

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
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
            padding: "20px 24px 12px",
          }}
        >
          {/* Title + source */}
          <h1
            style={{
              color: palette.gold,
              fontSize: "clamp(1.5rem, 1.2rem + 1.25vw, 2.25rem)",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {data?.title}
          </h1>
          <p
            style={{
              color: palette.muted,
              fontSize: "clamp(0.875rem, 0.8rem + 0.35vw, 1rem)",
              marginTop: 6,
              marginBottom: 18,
            }}
          >
            {data?.source}
          </p>

          {/* ── TAB BAR ── */}
          <nav
            role="tablist"
            aria-label="Topic tabs"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
              paddingBottom: 2,
            }}
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
      <main
        style={{
          maxWidth: "1400px",
          margin: "auto",
          padding: "24px",
        }}
      >
        {activeTab === "notes"    && <NotesTab    data={data} />}
        {activeTab === "revision" && <RevisionTab data={data} />}
        {COMING_SOON[activeTab]   && <ComingSoonPanel {...COMING_SOON[activeTab]} />}
      </main>
    </div>
  );
}
