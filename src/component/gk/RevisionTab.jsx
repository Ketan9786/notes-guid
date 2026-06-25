// component/gk/RevisionTab.jsx
// Compatible with ancient-history.json
import { useState, useMemo, useCallback } from "react";

const C = {
  text:      "var(--color-text-primary,   #E8EAF2)",
  muted:     "var(--color-text-secondary, #7B82A0)",
  hint:      "var(--color-text-tertiary,  #4F5370)",
  bg:        "var(--color-background-primary,   #0F1117)",
  surface:   "var(--color-background-secondary, #1A1D27)",
  raised:    "var(--color-background-tertiary,  #21253A)",
  border:    "var(--color-border-tertiary,  rgba(255,255,255,0.08))",
  borderMd:  "var(--color-border-secondary, rgba(255,255,255,0.14))",
  infoBg:    "var(--color-background-info,    rgba(99,102,241,0.12))",
  infoText:  "var(--color-text-info,          #6366F1)",
  warnBg:    "var(--color-background-warning,  rgba(245,158,11,0.12))",
  warnText:  "var(--color-text-warning,        #F59E0B)",
  successBg: "var(--color-background-success,  rgba(16,185,129,0.12))",
  successTx: "var(--color-text-success,        #10B981)",
  dangerBg:  "var(--color-background-danger,   rgba(239,68,68,0.12))",
  dangerTx:  "var(--color-text-danger,         #EF4444)",
};

const Pill = ({ label, bg, color, style: extra = {} }) => (
  <span style={{ display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: bg, color, whiteSpace: "nowrap", flexShrink: 0, ...extra }}>
    {label}
  </span>
);

const typeStyle = (t) => ({ pyq: [C.infoBg, C.infoText], tip: [C.warnBg, C.warnText], table: [C.successBg, C.successTx], fact: [C.surface, C.muted] }[t] ?? [C.surface, C.muted]);

function resolveType(ch) {
  if (Array.isArray(ch.pyqs) && ch.pyqs.length > 0) return "pyqs";
  return ch.type ?? "content";
}

function extractFacts(data) {
  const facts = [];
  (data?.chapters ?? []).forEach((ch) => {
    const type = resolveType(ch);
    if (type === "summary" && !Array.isArray(ch.pyqs)) return;

    if (type === "pyqs") {
      (ch.pyqs ?? []).forEach((p) => {
        const q = p.q ?? p.question ?? "";
        if (!q) return;
        facts.push({ id: `pyq-${ch.id}-${facts.length}`, chapter: ch.chapter, icon: ch.icon ?? "🎯", type: "pyq", exam: p.exam ?? "PYQ", qNum: p.q_num ?? null, front: q, back: String(p.answer ?? p.ans ?? ""), imp: false });
      });
      return;
    }

    (ch.subtopics ?? []).forEach((st) => {
      (st.content ?? []).forEach((line) => {
        const raw = String(line ?? "");
        const imp = /\s?#imp/i.test(raw);
        const clean = raw.replace(/\s?#imp/gi, "").trim();
        if (!clean) return;
        facts.push({ id: `fact-${ch.id}-${facts.length}`, chapter: ch.chapter, icon: ch.icon ?? "📚", type: "fact", topic: st.name, front: clean, back: null, imp });
      });
      const allTips = [...(st.exam_tips ?? []), ...(st.amaravati_tip ? [st.amaravati_tip] : [])];
      allTips.forEach((tip) => {
        const clean = String(tip ?? "").replace(/\s?#imp/gi, "").trim();
        if (!clean) return;
        facts.push({ id: `tip-${ch.id}-${facts.length}`, chapter: ch.chapter, icon: ch.icon ?? "📚", type: "tip", topic: st.name, front: clean, back: null, imp: true });
      });
      (st.table ?? []).forEach((row) => {
        const vals = Object.values(row).map(String);
        const keys = Object.keys(row);
        if (vals.length < 2) return;
        facts.push({ id: `tbl-${ch.id}-${facts.length}`, chapter: ch.chapter, icon: ch.icon ?? "📚", type: "table", topic: st.name, front: vals[0], back: keys.slice(1).map((k, i) => `${k}: ${vals[i + 1]}`).join(" · "), imp: false });
      });
    });
  });
  return facts;
}

const MODES = ["Quick Facts", "Flashcards", "PYQ Quiz"];

// ── Mode 1: Quick Facts ───────────────────────────────────────────
function QuickFacts({ facts }) {
  const [filterChapter, setFilterChapter] = useState("All");
  const [filterType,    setFilterType]    = useState("All");
  const [impOnly,       setImpOnly]       = useState(false);
  const chapterNames = useMemo(() => ["All", ...new Set(facts.map((f) => f.chapter))], [facts]);
  const filtered = useMemo(() => facts.filter((f) => {
    if (filterChapter !== "All" && f.chapter !== filterChapter) return false;
    if (filterType    !== "All" && f.type    !== filterType)    return false;
    if (impOnly && !f.imp) return false;
    return true;
  }), [facts, filterChapter, filterType, impOnly]);

  const sel = { fontSize: 13, padding: "5px 10px", borderRadius: 6, background: C.surface, color: C.text, border: `0.5px solid ${C.borderMd}`, cursor: "pointer", maxWidth: 200 };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <select value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)} style={sel}>
          {chapterNames.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...sel, maxWidth: 140 }}>
          {["All", "fact", "pyq", "tip", "table"].map((t) => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
        </select>
        <button onClick={() => setImpOnly((v) => !v)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: impOnly ? C.warnBg : "transparent", color: impOnly ? C.warnText : C.muted, border: `0.5px solid ${impOnly ? C.warnText : C.borderMd}`, cursor: "pointer" }}>
          ★ Imp only
        </button>
        <span style={{ fontSize: 12, color: C.muted, marginLeft: "auto" }}>{filtered.length} facts · {filtered.filter((f) => f.imp).length} imp</span>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {filtered.map((f) => {
          const [bg, col] = typeStyle(f.type);
          return (
            <div key={f.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: f.imp ? C.warnBg : C.surface, border: `0.5px solid ${f.imp ? C.warnText + "55" : C.border}` }}>
              {f.imp && <span style={{ color: C.warnText, fontSize: 14, flexShrink: 0, marginTop: 1 }}>★</span>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>{f.front}</div>
                {f.back && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>→ {f.back}</div>}
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: C.hint }}>{f.icon} {f.chapter}</span>
                  {f.topic && <span style={{ fontSize: 11, color: C.hint }}>· {f.topic}</span>}
                </div>
              </div>
              <Pill label={f.type} bg={bg} color={col} />
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 14 }}>No facts match the current filters.</div>}
    </div>
  );
}

// ── Mode 2: Flashcards ────────────────────────────────────────────
function Flashcards({ facts }) {
  const deck    = useMemo(() => facts.filter((f) => f.type !== "fact" || f.imp), [facts]);
  const [idx,     setIdx]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done,    setDone]    = useState(new Set());
  const card     = deck[idx];
  const progress = deck.length ? Math.round((done.size / deck.length) * 100) : 0;
  const next     = useCallback(() => { setFlipped(false); setIdx((i) => (i + 1) % deck.length); }, [deck.length]);
  const prev     = useCallback(() => { setFlipped(false); setIdx((i) => (i - 1 + deck.length) % deck.length); }, [deck.length]);
  const markDone = () => { setDone((s) => new Set([...s, card.id])); next(); };
  if (!card) return <div style={{ textAlign: "center", padding: 40, color: C.muted }}>No flashcards available.</div>;
  const isDone = done.has(card.id);
  const [typeBg, typeCol] = typeStyle(card.type);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: C.muted }}>{idx + 1} / {deck.length}</span>
        <span style={{ fontSize: 13, color: C.successTx }}>{done.size} done</span>
      </div>
      <div style={{ height: 4, background: C.raised, borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: C.successTx, transition: "width .3s" }} />
      </div>
      <div
        role="button" tabIndex={0}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFlipped((v) => !v)}
        style={{ minHeight: 200, borderRadius: 12, border: `0.5px solid ${isDone ? C.successTx + "88" : C.borderMd}`, background: isDone ? C.successBg : C.surface, padding: "28px 28px 24px", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", userSelect: "none", transition: "background .2s" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.hint }}>{card.icon} {card.chapter}{card.topic ? ` · ${card.topic}` : ""}</span>
          <Pill label={card.type} bg={typeBg} color={typeCol} />
        </div>
        {!flipped ? (
          <div>
            {card.imp && <span style={{ fontSize: 12, color: C.warnText, marginBottom: 8, display: "block" }}>★ Important</span>}
            <div style={{ fontSize: 16, color: C.text, lineHeight: 1.7, fontWeight: 500 }}>{card.front}</div>
            {card.back && <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: C.hint }}>tap to reveal →</div>}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Answer</div>
            <div style={{ fontSize: 15, color: C.infoText, lineHeight: 1.7 }}>{card.back || card.front}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={prev}     style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, background: C.surface, color: C.muted, border: `0.5px solid ${C.borderMd}`, cursor: "pointer" }}>← Prev</button>
        <button onClick={markDone} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, background: C.successBg, color: C.successTx, border: `0.5px solid ${C.successTx}55`, cursor: "pointer" }}>✓ Got it</button>
        <button onClick={next}     style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, background: C.surface, color: C.muted, border: `0.5px solid ${C.borderMd}`, cursor: "pointer" }}>Next →</button>
      </div>
      {done.size > 0 && done.size === deck.length && (
        <div style={{ marginTop: 20, textAlign: "center", padding: 16, borderRadius: 8, background: C.successBg, color: C.successTx, fontSize: 14 }}>🎉 All {deck.length} cards reviewed!</div>
      )}
    </div>
  );
}

// ── Mode 3: PYQ Quiz ──────────────────────────────────────────────
function PYQQuiz({ facts }) {
  const pyqs = useMemo(() => facts.filter((f) => f.type === "pyq"), [facts]);
  const exams = useMemo(() => ["All", ...new Set(pyqs.map((p) => p.exam))], [pyqs]);
  const [revealed,   setRevealed]   = useState(new Set());
  const [scores,     setScores]     = useState({});
  const [filterExam, setFilterExam] = useState("All");
  const visible  = useMemo(() => pyqs.filter((p) => filterExam === "All" || p.exam === filterExam), [pyqs, filterExam]);
  const reveal   = (id) => setRevealed((s) => new Set([...s, id]));
  const mark     = (id, v) => setScores((s) => ({ ...s, [id]: v }));
  const resetAll = () => { setRevealed(new Set()); setScores({}); };
  const correct  = Object.values(scores).filter((v) => v === "yes").length;
  const total    = Object.keys(scores).length;

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)} style={{ fontSize: 13, padding: "5px 10px", borderRadius: 6, background: C.surface, color: C.text, border: `0.5px solid ${C.borderMd}`, cursor: "pointer" }}>
          {exams.map((e) => <option key={e}>{e}</option>)}
        </select>
        {total > 0 && <span style={{ fontSize: 13, color: C.successTx }}>{correct}/{total} correct ({Math.round((correct / total) * 100)}%)</span>}
        <button onClick={resetAll} style={{ marginLeft: "auto", fontSize: 12, padding: "5px 12px", cursor: "pointer", borderRadius: 6, background: C.surface, color: C.muted, border: `0.5px solid ${C.borderMd}` }}>Reset all</button>
      </div>
      {total > 0 && (
        <div style={{ height: 4, background: C.raised, borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ width: `${Math.round((correct / visible.length) * 100)}%`, height: "100%", background: C.successTx, borderRadius: 2 }} />
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {visible.map((p) => {
          const isRevealed = revealed.has(p.id);
          const score      = scores[p.id];
          const borderCol  = score === "yes" ? C.successTx + "88" : score === "no" ? C.dangerTx + "88" : C.border;
          const bgCol      = score === "yes" ? C.successBg : score === "no" ? C.dangerBg : C.surface;
          return (
            <div key={p.id} style={{ borderRadius: 8, border: `0.5px solid ${borderCol}`, background: bgCol, overflow: "hidden", transition: "background .2s, border-color .2s" }}>
              <div style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                {p.qNum && <Pill label={p.qNum} bg={C.warnBg} color={C.warnText} />}
                <Pill label={p.exam} bg={C.infoBg} color={C.infoText} />
                <span style={{ flex: 1, minWidth: 180, fontSize: 14, color: C.text, lineHeight: 1.65 }}>{p.front}</span>
                {!isRevealed ? (
                  <button onClick={() => reveal(p.id)} style={{ fontSize: 12, padding: "4px 12px", cursor: "pointer", borderRadius: 6, background: C.infoBg, color: C.infoText, border: `0.5px solid ${C.infoText}55` }}>Show</button>
                ) : !score ? (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => mark(p.id, "yes")} style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer", borderRadius: 6, background: C.successBg, color: C.successTx, border: `0.5px solid ${C.successTx}55` }}>✓</button>
                    <button onClick={() => mark(p.id, "no")}  style={{ fontSize: 12, padding: "4px 10px", cursor: "pointer", borderRadius: 6, background: C.dangerBg,  color: C.dangerTx,  border: `0.5px solid ${C.dangerTx}55` }}>✗</button>
                  </div>
                ) : null}
              </div>
              {isRevealed && (
                <div style={{ padding: "10px 14px", borderTop: `0.5px solid ${C.border}`, background: C.raised, fontSize: 13, color: C.infoText, lineHeight: 1.65 }}>↳ {p.back}</div>
              )}
            </div>
          );
        })}
      </div>
      {visible.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.muted, fontSize: 14 }}>No PYQs match the filter.</div>}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function RevisionTab({ data }) {
  const [mode, setMode] = useState(0);
  const facts = useMemo(() => extractFacts(data), [data]);
  const stats = useMemo(() => ({
    total:  facts.length,
    imp:    facts.filter((f) => f.imp).length,
    pyqs:   facts.filter((f) => f.type === "pyq").length,
    cards:  facts.filter((f) => f.type !== "fact" || f.imp).length,
  }), [facts]);

  return (
    <div style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 500, color: C.text }}>
            Revision — {(data?.title ?? "GK Notes").split("–")[0]?.trim()}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
            {stats.total} facts · {stats.imp} important · {stats.pyqs} PYQs
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill label={`${stats.imp} ★ imp`}  bg={C.warnBg}    color={C.warnText} />
          <Pill label={`${stats.pyqs} PYQs`}  bg={C.infoBg}    color={C.infoText} />
          <Pill label={`${stats.cards} cards`} bg={C.successBg} color={C.successTx} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.surface, padding: 4, borderRadius: 8, width: "fit-content" }}>
        {MODES.map((m, i) => (
          <button key={m} onClick={() => setMode(i)} style={{ fontSize: 13, fontWeight: mode === i ? 500 : 400, padding: "7px 18px", borderRadius: 6, background: mode === i ? C.bg : "transparent", color: mode === i ? C.text : C.muted, border: mode === i ? `0.5px solid ${C.borderMd}` : "0.5px solid transparent", cursor: "pointer", transition: "all .15s" }}>
            {m}
          </button>
        ))}
      </div>
      {mode === 0 && <QuickFacts facts={facts} />}
      {mode === 1 && <Flashcards facts={facts} />}
      {mode === 2 && <PYQQuiz    facts={facts} />}
    </div>
  );
}
