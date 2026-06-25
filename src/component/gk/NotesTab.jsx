// component/gk/NotesTab.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import palette from "../../theme/Theme";

function useLineHighlight() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
    const group = ref.current?.closest("[data-reading-group]");
    if (group) group.setAttribute("data-reading-focus", "active");
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    const group = ref.current?.closest("[data-reading-group]");
    if (group) group.removeAttribute("data-reading-focus");
  }, []);

  return { ref, hovered, onMouseEnter, onMouseLeave };
}

function ReadingProgressBar({ scrollRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.round((scrollTop / max) * 100) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        height: 4,
        background: "rgba(255,255,255,0.04)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${palette.gold}, ${palette.accent})`,
          borderRadius: 999,
          transition: "width 120ms linear",
          boxShadow: `0 0 12px ${palette.focusGlow}`,
        }}
      />
    </div>
  );
}

function Bullet({ text }) {
  const imp = text.includes("#imp");
  const clean = text.replace(/ #imp/g, "");
  const { ref, hovered, onMouseEnter, onMouseLeave } = useLineHighlight();

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="readable-line"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontSize: 15,
        lineHeight: 1.86,
        letterSpacing: "0.01em",
        color: palette.textSoft,
        padding: "10px 14px",
        borderRadius: 10,
        cursor: "default",
        background: hovered
          ? imp
            ? "rgba(208,174,110,0.14)"
            : palette.hover
          : imp
          ? "rgba(208,174,110,0.09)"
          : palette.raisedSoft,
        border: `1px solid ${hovered ? (imp ? palette.gold : palette.accentBorder) : palette.border}`,
        boxShadow: hovered
          ? `0 8px 24px rgba(0,0,0,0.18), 0 0 0 1px ${imp ? 'rgba(208,174,110,0.20)' : 'rgba(132,167,196,0.14)'}`
          : "none",
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        transition: "all 180ms ease",
      }}
    >
      <span
        style={{
          color: imp ? palette.gold : palette.accent,
          marginTop: 2,
          flexShrink: 0,
          fontSize: 14,
          opacity: hovered || imp ? 1 : 0.72,
          transition: "opacity 160ms ease",
        }}
      >
        {imp ? "✦" : "•"}
      </span>
      <span style={{ flex: 1 }}>{clean}</span>
    </div>
  );
}

function ExamTip({ tip }) {
  const { ref, hovered, onMouseEnter, onMouseLeave } = useLineHighlight();

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="readable-line"
      style={{
        fontSize: 14,
        lineHeight: 1.8,
        color: palette.textSoft,
        padding: "10px 14px",
        borderRadius: 10,
        background: hovered ? "rgba(208,174,110,0.16)" : palette.goldSoft,
        border: `1px solid ${hovered ? 'rgba(208,174,110,0.34)' : 'rgba(208,174,110,0.18)'}`,
        transition: "all 180ms ease",
        boxShadow: hovered ? "0 8px 20px rgba(0,0,0,0.14)" : "none",
      }}
    >
      {tip}
    </div>
  );
}

function SiteChip({ clean, imp }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 12,
        lineHeight: 1.5,
        padding: "8px 11px",
        borderRadius: 999,
        background: hovered
          ? imp
            ? "rgba(208,174,110,0.14)"
            : palette.hover
          : imp
          ? "rgba(208,174,110,0.10)"
          : palette.raised,
        color: imp ? palette.gold : palette.muted,
        border: `1px solid ${hovered ? (imp ? 'rgba(208,174,110,0.34)' : palette.accentBorder) : palette.border}`,
        transition: "all 160ms ease",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {clean}
    </div>
  );
}

function SitesGrid({ sites }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: palette.faint,
          textTransform: "uppercase",
          letterSpacing: ".12em",
          marginBottom: 10,
        }}
      >
        Major Sites
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}
      >
        {sites.map((s, i) => {
          const imp = s.includes("#imp");
          const clean = s.replace(/ #imp/g, "");
          return <SiteChip key={i} clean={clean} imp={imp} />;
        })}
      </div>
    </div>
  );
}

function AutoTable({ rows }) {
  if (!rows?.length) return null;
  const cols = Object.keys(rows[0]);
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div
      style={{
        overflowX: "auto",
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        background: palette.raisedSoft,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "12px 14px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: palette.text,
                  background: palette.navyRaised,
                  borderBottom: `1px solid ${palette.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              onMouseEnter={() => setHoveredRow(ri)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: hoveredRow === ri ? "rgba(132,167,196,0.10)" : ri % 2 ? palette.raised : "transparent",
                transition: "background 160ms ease",
              }}
            >
              {Object.values(row).map((val, vi) => (
                <td
                  key={vi}
                  style={{
                    padding: "11px 14px",
                    color: palette.textSoft,
                    borderBottom: `1px solid rgba(255,255,255,0.04)`,
                    verticalAlign: "top",
                    lineHeight: 1.7,
                  }}
                >
                  {String(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, period, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 14,
        background: palette.navy,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((v) => !v)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          cursor: "pointer",
          background: open ? palette.navyRaised : palette.navy,
          userSelect: "none",
          transition: "background 180ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 650,
              color: palette.text,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </span>
          {period && (
            <span
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
                background: palette.goldSoft,
                color: palette.gold,
                border: "1px solid rgba(208,174,110,0.18)",
              }}
            >
              {period}
            </span>
          )}
        </div>
        <span
          style={{
            color: palette.muted,
            fontSize: 16,
            transition: "transform 200ms ease",
            transform: open ? "rotate(90deg)" : "none",
          }}
        >
          ›
        </span>
      </div>

      {open && (
        <div
          data-reading-group
          style={{
            padding: 18,
            display: "grid",
            gap: 10,
            background: palette.navy,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}

function SubtopicBody({ st }) {
  return (
    <>
      {st.content?.map((item, i) => <Bullet key={i} text={item} />)}

      {st.exam_tips?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: palette.faint,
              textTransform: "uppercase",
              letterSpacing: ".12em",
              marginBottom: 10,
            }}
          >
            Exam Tips
          </div>
          <div data-reading-group style={{ display: "grid", gap: 8 }}>
            {st.exam_tips.map((tip, i) => <ExamTip key={i} tip={tip} />)}
          </div>
        </div>
      )}

      {st.major_sites?.length > 0 && <SitesGrid sites={st.major_sites} />}
      {st.table?.length > 0 && <AutoTable rows={st.table} />}
    </>
  );
}

function ContentChapter({ chapter }) {
  return (
    <div>
      {chapter.subtopics?.map((st, i) => (
        <Section key={i} title={st.name} period={st.period}>
          <SubtopicBody st={st} />
        </Section>
      ))}
    </div>
  );
}

const WT_COLOR = {
  "Very High": "#CFA86A",
  High: "#84A7C4",
  Moderate: "#8DB59A",
};

function SummaryChapter({ chapter }) {
  const rows = chapter.table || [];
  const maxQ = Math.max(...rows.map((r) => r.questions || 0), 1);
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: 12,
        background: palette.navy,
      }}
    >
      {rows.map((row, i) => {
        const q = row.questions || 0;
        const pct = Math.round((q / maxQ) * 100);
        const col = WT_COLOR[row.weightage] || palette.muted;
        const isHovered = hoveredRow === i;

        return (
          <div
            key={i}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(180px, 240px) 1fr 40px auto",
              alignItems: "center",
              gap: 12,
              padding: "12px 12px",
              borderRadius: 12,
              background: isHovered ? `${col}16` : palette.raisedSoft,
              border: `1px solid ${isHovered ? col + '55' : palette.border}`,
              transition: "all 160ms ease",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: palette.text }}>{row.topic}</div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: col,
                  borderRadius: 999,
                  opacity: isHovered ? 1 : 0.84,
                  transition: "width 300ms ease",
                }}
              />
            </div>
            <div style={{ fontSize: 12, color: palette.textSoft, textAlign: "right" }}>{q}</div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 999,
                color: col,
                background: `${col}18`,
                border: `1px solid ${col}33`,
                whiteSpace: "nowrap",
              }}
            >
              {row.weightage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PYQRow({ p }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        background: hovered ? "rgba(132,167,196,0.10)" : palette.raisedSoft,
        border: `1px solid ${hovered ? palette.accentBorder : palette.border}`,
        transition: "all 180ms ease",
        boxShadow: hovered ? "0 8px 20px rgba(0,0,0,0.14)" : "none",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          fontSize: 11,
          fontWeight: 700,
          padding: "4px 9px",
          borderRadius: 999,
          background: palette.goldSoft,
          color: palette.gold,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {p.exam}
      </span>
      <span style={{ flex: 1, fontSize: 14, color: palette.textSoft, lineHeight: 1.8 }}>
        {p.q}
      </span>
      <span
        title={p.answer}
        style={{
          flexShrink: 0,
          fontSize: 12,
          fontWeight: 600,
          color: palette.accent,
          background: palette.accentBg,
          padding: "4px 9px",
          borderRadius: 8,
          maxWidth: 200,
          lineHeight: 1.6,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          border: `1px solid ${palette.accentBorder}`,
        }}
      >
        {p.answer.length > 40 ? p.answer.slice(0, 38) + "…" : p.answer}
      </span>
    </div>
  );
}

function PYQChapter({ chapter }) {
  const pyqs = chapter.pyqs || [];
  const exams = [...new Set(pyqs.map((p) => p.exam))];

  return (
    <div>
      {exams.map((exam) => {
        const items = pyqs.filter((p) => p.exam === exam);
        return (
          <Section key={exam} title={exam} defaultOpen>
            <div style={{ display: "grid", gap: 8 }}>
              {items.map((p, i) => <PYQRow key={i} p={p} />)}
            </div>
          </Section>
        );
      })}
    </div>
  );
}

function SidebarBtn({ chapter, active, onClick }) {
  const metaText =
    chapter.type === "pyqs"
      ? `${chapter.pyqs?.length || 0} Q&As`
      : chapter.type === "summary"
      ? "Weightage"
      : `${chapter.subtopics?.length || 0} topics`;

  return (
    <button
      onClick={onClick}
      aria-selected={active}
      style={{
        width: "100%",
        textAlign: "left",
        background: active ? palette.navyRaised : "transparent",
        border: "none",
        borderBottom: `1px solid rgba(255,255,255,0.04)`,
        borderLeft: active ? `3px solid ${palette.gold}` : "3px solid transparent",
        cursor: "pointer",
        padding: "12px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        transition: "all 180ms ease",
        color: active ? palette.muted : palette.muted,
      }}
    >
      {chapter.icon && <span style={{ fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>{chapter.icon}</span>}
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 650,
            color: active ? palette.text : palette.textSoft,
            lineHeight: 1.5,
          }}
        >
          {chapter.chapter}
        </div>
        <div style={{ fontSize: 11, color: palette.muted, marginTop: 3 }}>{metaText}</div>
      </div>
    </button>
  );
}

function ChapterHeader({ chapter }) {
  const metaText =
    chapter.type === "pyqs"
      ? `${chapter.pyqs?.length || 0} previous year questions`
      : chapter.type === "summary"
      ? "Chapter-wise weightage overview"
      : `${chapter.subtopics?.length || 0} topics`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        paddingBottom: 18,
        marginBottom: 22,
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      {chapter.icon && <span style={{ fontSize: 28 }}>{chapter.icon}</span>}
      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: palette.text,
            fontFamily: "var(--font-reading-display, 'Merriweather', Georgia, serif)",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
          }}
        >
          {chapter.chapter}
        </div>
        <div style={{ fontSize: 13, color: palette.muted, marginTop: 5 }}>{metaText}</div>
      </div>
    </div>
  );
}

const READING_FOCUS_STYLE = `
  [data-reading-focus="active"] .readable-line:not(:hover) {
    opacity: 0.52;
    filter: saturate(0.92);
    transition: opacity 0.18s ease, filter 0.18s ease;
  }
  [data-reading-focus="active"] .readable-line:hover {
    opacity: 1;
  }
`;

function ReadingFocusStyleInjector() {
  useEffect(() => {
    const id = "gk-reading-focus-style";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = READING_FOCUS_STYLE;
      document.head.appendChild(tag);
    }
  }, []);
  return null;
}

export default function NotesTab({ data }) {
  const chapters = data?.chapters || [];
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? null);
  const active = chapters.find((c) => c.id === activeId);
  const mainRef = useRef(null);

  useEffect(() => {
    if (chapters.length && !chapters.some((c) => c.id === activeId)) {
      setActiveId(chapters[0]?.id ?? null);
    }
  }, [chapters, activeId]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeId]);

  return (
    <>
      <ReadingFocusStyleInjector />
      <div
        style={{
          display: "flex",
          minHeight: 640,
          border: `1px solid ${palette.border}`,
          borderRadius: 18,
          overflow: "hidden",
          background: palette.ink,
          color: palette.text,
          fontFamily: "var(--font-reading-body, 'Inter', 'Segoe UI', sans-serif)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        }}
      >
        <aside
          aria-label="Chapter navigation"
          style={{
            width: 250,
            flexShrink: 0,
            borderRight: `1px solid ${palette.border}`,
            overflowY: "auto",
            background: palette.navy,
          }}
        >
          <div
            style={{
              padding: "18px 16px 14px",
              borderBottom: `1px solid ${palette.border}`,
              position: "sticky",
              top: 0,
              background: "rgba(36,42,51,0.92)",
              backdropFilter: "blur(12px)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 750,
                color: palette.text,
                lineHeight: 1.4,
              }}
            >
              {data?.title?.split("–")[0]?.trim() || "GK Notes"}
            </div>
            {data?.source && (
              <div style={{ fontSize: 11, color: palette.muted, marginTop: 4, lineHeight: 1.6 }}>
                {data.source}
              </div>
            )}
          </div>

          {chapters.map((ch) => (
            <SidebarBtn
              key={ch.id}
              chapter={ch}
              active={ch.id === activeId}
              onClick={() => setActiveId(ch.id)}
            />
          ))}
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <ReadingProgressBar scrollRef={mainRef} />

          <main
            ref={mainRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "28px 32px",
              background: `linear-gradient(180deg, ${palette.ink} 0%, #20262F 100%)`,
            }}
          >
            {active ? (
              <>
                <ChapterHeader chapter={active} />
                {active.type === "content" && <ContentChapter chapter={active} />}
                {active.type === "summary" && <SummaryChapter chapter={active} />}
                {active.type === "pyqs" && <PYQChapter chapter={active} />}
              </>
            ) : (
              <div style={{ color: palette.muted, fontSize: 14 }}>Select a chapter</div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
