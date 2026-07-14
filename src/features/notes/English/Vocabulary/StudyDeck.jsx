
import { useState, useMemo, useEffect } from "react";

/**
 * StudyDeck.jsx
 * Colorful, exam-ready, responsive vocabulary/idiom study component,
 * styled as a classic "One Word Substitution" exam table (SN | Phrase/Meaning |
 * One Word (PoS) | Hindi/Marathi | Memory Tip) in Reading mode, plus a
 * flashcard-style Active Recall mode.
 *
 * Works for ANY dataset shaped like: { title, totalWords, words: [...] }
 *
 * Each word object can optionally include:
 *   sn, word | idiom, pos, phrase | meaning, hindi, memoryTip,
 *   spelling_asked, syn_ant_asked, repetition, highlight (0 | 1)
 *
 * `highlight: 1` marks a word for revision (not recalled yet / needs more review).
 * If the field is missing entirely, the UI renders normally with no highlight —
 * it never breaks.
 *
 * Usage:
 *   import owsData from "./ows-1-408.json";
 *   <StudyDeck data={owsData} />
 */

const THEME = {
  light: {
    bg: "bg-gradient-to-b from-[#f4f7fb] to-[#eef1f8]",
    paper: "bg-white",
    border: "border-slate-200",
    text: "text-slate-800",
    subtext: "text-slate-500",
    accent: "text-indigo-700",
    accentBg: "bg-indigo-600",
    accentBgSoft: "bg-indigo-50",
    ring: "focus:ring-indigo-400/40",
    shadow: "shadow-[0_2px_10px_rgba(15,23,42,0.06)]",
    divider: "divide-slate-200",
    headerBg: "bg-gradient-to-r from-[#1e2a63] via-[#26348a] to-[#3956c9]",
    headerText: "text-white",
    badgeBg: "bg-amber-400 text-slate-900",
    // table header column colors (matches reference image)
    colSn: "bg-[#1e2a63] text-white",
    colPhrase: "bg-[#3f4bbd] text-white",
    colWord: "bg-[#7b2fbf] text-white",
    colHindi: "bg-[#0f7a6b] text-white",
    colTip: "bg-[#c98a00] text-white",
    rowEven: "bg-white",
    rowOdd: "bg-[#eef2ff]",
    posText: "text-fuchsia-600",
    hindiText: "text-teal-700 font-semibold",
    tipText: "text-amber-700",
    tipStrong: "font-semibold",
    highlightBg: "bg-yellow-100",
    highlightRing: "ring-2 ring-yellow-400/70",
    highlightBadge: "bg-yellow-400 text-yellow-900",
    highlightTerm: "text-yellow-800",
    spellingChip: "bg-orange-100 text-orange-700",
    synAntChip: "bg-teal-100 text-teal-700",
    repChip: "bg-slate-100 text-slate-600",
    footerBg: "bg-amber-50 border-amber-200 text-amber-800",
  },
  dark: {
    bg: "bg-gradient-to-b from-[#0b1020] to-[#0f172a]",
    paper: "bg-[#111827]",
    border: "border-slate-700/60",
    text: "text-slate-100",
    subtext: "text-slate-400",
    accent: "text-indigo-300",
    accentBg: "bg-indigo-500",
    accentBgSoft: "bg-indigo-500/10",
    ring: "focus:ring-indigo-400/40",
    shadow: "shadow-[0_2px_16px_rgba(0,0,0,0.55)]",
    divider: "divide-slate-800",
    headerBg: "bg-gradient-to-r from-[#1e2a63] via-[#26348a] to-[#3956c9]",
    headerText: "text-white",
    badgeBg: "bg-amber-400 text-slate-900",
    colSn: "bg-[#141c47] text-white",
    colPhrase: "bg-[#2f3a99] text-white",
    colWord: "bg-[#5c2591] text-white",
    colHindi: "bg-[#0b5f52] text-white",
    colTip: "bg-[#96690a] text-white",
    rowEven: "bg-[#111827]",
    rowOdd: "bg-[#0d1430]",
    posText: "text-fuchsia-300",
    hindiText: "text-teal-300 font-semibold",
    tipText: "text-amber-300",
    tipStrong: "font-semibold",
    highlightBg: "bg-yellow-500/10",
    highlightRing: "ring-2 ring-yellow-400/50",
    highlightBadge: "bg-yellow-500 text-yellow-950",
    highlightTerm: "text-yellow-300",
    spellingChip: "bg-orange-500/20 text-orange-300",
    synAntChip: "bg-teal-500/20 text-teal-300",
    repChip: "bg-slate-700/60 text-slate-300",
    footerBg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
};

function normalize(item) {
  return {
    sn: item.sn,
    term: item.word || item.idiom || item.phrase || "",
    pos: item.pos || "",
    meaning: item.phrase || item.meaning || "",
    hindi: item.hindi || "",
    tip: item.memoryTip || "",
    spelling: !!item.spelling_asked,
    synAnt: !!item.syn_ant_asked,
    repetition: item.repetition || null,
    highlight: item.highlight === 1 || item.highlight === true || item.highlight === "1",
  };
}

export default function StudyDeck({ data, tableHeader }) {
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("read"); // "read" | "recall"
  const [search, setSearch] = useState("");
  const [onlyHighlighted, setOnlyHighlighted] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const items = useMemo(() => (data?.words || []).map(normalize), [data]);
  const highlightCount = useMemo(() => items.filter((i) => i.highlight).length, [items]);

  const filtered = useMemo(() => {
    let rows = items;
    if (onlyHighlighted) rows = rows.filter((r) => r.highlight);
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.term.toLowerCase().includes(q) ||
        r.meaning.toLowerCase().includes(q) ||
        r.hindi.includes(q)
    );
  }, [search, items, onlyHighlighted]);

  const t = THEME[theme];

  return (
    <div className={`min-h-screen w-full ${t.bg} transition-colors duration-300`}>
      <div className="w-full  mx-auto px-3 sm:px-5 md:px-10 py-10 sm:py-10">
        <Header
          title={data?.title || "Study Deck"}
          count={items.length}
          highlightCount={highlightCount}
          theme={theme}
          t={t}
          onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <ModeSwitch mode={mode} setMode={setMode} t={t} />
          {mode === "read" && highlightCount > 0 && (
            <button
              onClick={() => {
                setOnlyHighlighted((v) => !v);
                setPage(1);
              }}
              className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border font-medium transition self-start sm:self-auto ${
                onlyHighlighted
                  ? "bg-yellow-400 text-yellow-950 border-yellow-500"
                  : `${t.border} ${t.text}`
              }`}
            >
              ⭐ Revision only ({highlightCount})
            </button>
          )}
        </div>

        {mode === "read" ? (
          <ReadingMode
            t={t}
            tableHeader={tableHeader}
            items={filtered}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
          />
        ) : (
          <RecallMode t={t} items={items} />
        )}
      </div>
    </div>
  );
}

function Header({ title, count, highlightCount, theme, t, onToggleTheme }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 mb-5  px-4 sm:px-6 py-4 sm:py-5 ${t.headerBg} ${t.shadow}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className={`text-base sm:text-xl font-extrabold ${t.headerText} tracking-tight truncate`}>
            {title}
          </h1>
          <p className="text-[11px] sm:text-xs text-white/80 mt-0.5">
            {count} entries
            {highlightCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                · <span className="text-yellow-300">⭐ {highlightCount} for revision</span>
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`hidden sm:inline text-[11px] font-bold px-3 py-1.5 rounded-full ${t.badgeBg} shadow-sm`}>
          {count} Important Words
        </span>
        <button
          onClick={onToggleTheme}
          className="text-xs px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/25 hover:bg-white/25 transition"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </div>
  );
}

function ModeSwitch({ mode, setMode, t }) {
  return (
    <div className={`flex gap-1 p-1 rounded-full ${t.accentBgSoft} w-fit`}>
      {[
        { key: "read", label: "📖 Reading" },
        { key: "recall", label: "🧠 Active Recall" },
      ].map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`text-xs sm:text-sm px-4 sm:px-4 py-1.5 transition font-medium ${
            mode === m.key ? `${t.accentBg} text-white shadow-sm` : `${t.subtext}`
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- READING MODE (exam-table style) ---------------- */

function ReadingMode({ t, items, search, setSearch, page, setPage, pageSize, tableHeader }) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageRows = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search word, meaning or Hindi..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={`text-sm border ${t.border} ${t.paper} ${t.text} focus:outline-none focus:ring-2 ${t.ring}`}
      />
      {pageRows.length === 0 ? (
        <div className={`rounded-2xl border ${t.border} ${t.paper} ${t.shadow} p-10 text-center`}>
          <p className={`text-sm ${t.subtext}`}>No matching entries found.</p>
        </div>
      ) : (
        <div className={`p-10 ${t.border} ${t.shadow} overflow-hidden`}>
          {/* Desktop / tablet table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={`border-b ${t.border} ${t.headerBg}`}>
                {tableHeader.map((col, idx) => (
                  <th key={idx} className={`p-10 text-left text-xs font-bold ${t.colPhrase} min-w-[40px] ${t.headerText}`}>
                    {col}
                  </th>
                ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, idx) => (
                  <tr
                    key={row.sn}
                    className={`${row.highlight ? t.highlightBg : idx % 2 === 0 ? t.rowEven : t.rowOdd} border-b ${t.border} align-top`}
                  >
                    <td className={`px-3 py-3 font-mono text-xs ${t.text}`}>{row.sn}</td>
                    <td className={`px-3 py-3 ${t.text}`}>
                      {row.meaning}
                      {row.highlight && (
                        <span
                          className={`ml-2 inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${t.highlightBadge}`}
                        >
                          ⭐ Revise
                        </span>
                      )}
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {row.spelling && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md ${t.spellingChip}`}>
                            ✎ spelling
                          </span>
                        )}
                        {row.synAnt && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md ${t.synAntChip}`}>
                            ⇄ syn/ant
                          </span>
                        )}
                        {row.repetition && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.repChip}`}>
                            asked {row.repetition}x
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`font-bold ${row.highlight ? t.highlightTerm : t.accent}`}
                      >
                        {row.term}
                      </span>
                      {row.pos && (
                        <span className={`ml-1 text-xs italic ${t.posText}`}>({row.pos})</span>
                      )}
                    </td>
                    <td className={`px-3 py-3 ${t.hindiText}`}>{row.hindi}</td>
                    {/* <td className={`px-3 py-3 text-xs ${t.tipText}`}>
                      <span className={t.tipStrong}>{row.term}</span>
                      {row.tip ? ` = ${row.tip}` : ""}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className={`md:hidden divide-y ${t.divider} ${t.paper}`}>
            {pageRows.map((row) => (
              <div
                key={row.sn}
                className={`px-4 py-4 ${row.highlight ? t.highlightBg : ""}`}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${t.colSn}`}>
                    #{row.sn}
                  </span>
                  <span
                    className={`font-bold text-base ${row.highlight ? t.highlightTerm : t.accent}`}
                  >
                    {row.term}
                  </span>
                  {row.pos && (
                    <span className={`text-xs italic ${t.posText}`}>({row.pos})</span>
                  )}
                  {row.highlight && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${t.highlightBadge}`}
                    >
                      ⭐ Revise
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1.5 ${t.text}`}>{row.meaning}</p>
                <div className="flex justify-between items-end mt-2 flex-wrap gap-2">
                  {row.hindi && <span className={`text-sm ${t.hindiText}`}>{row.hindi}</span>}
                  {row.tip && (
                    <span className={`text-xs italic ${t.tipText}`}>
                      💡 {row.term} = {row.tip}
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {row.spelling && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${t.spellingChip}`}>
                      ✎ spelling
                    </span>
                  )}
                  {row.synAnt && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${t.synAntChip}`}>
                      ⇄ syn/ant
                    </span>
                  )}
                  {row.repetition && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.repChip}`}>
                      asked {row.repetition}x
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Exam-tips footer strip */}
          <div className={`px-4 sm:px-5 py-2.5 border-t ${t.footerBg} text-[11px] sm:text-xs flex flex-wrap gap-x-4 gap-y-1 items-center`}>
            <span className="font-bold">⭐ Exam Tips:</span>
            <span>✅ Learn with meaning + usage.</span>
            <span>✅ Focus on root words.</span>
            <span>✅ Revise regularly.</span>
            <span>✅ Make your own sentences.</span>
          </div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} t={t} />
    </div>
  );
}

function Pagination({ page, totalPages, setPage, t }) {
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className={`text-sm px-3 py-1.5 rounded-full border ${t.border} ${t.text} disabled:opacity-30`}
      >
        ← Prev
      </button>
      <span className={`text-sm ${t.subtext}`}>
        {page} / {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className={`text-sm px-3 py-1.5 rounded-full border ${t.border} ${t.text} disabled:opacity-30`}
      >
        Next →
      </button>
    </div>
  );
}

/* ---------------- ACTIVE RECALL MODE ---------------- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function RecallMode({ t, items }) {
  const [deck, setDeck] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setDeck(shuffle(items));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setFinished(false);
  }, [items]);

  const current = deck[index];
  const progress = deck.length ? Math.round((index / deck.length) * 100) : 0;

  function handleAnswer(isKnown) {
    if (!current) return;
    if (isKnown) setKnown((k) => [...k, current.sn]);
    else setLearning((l) => [...l, current.sn]);

    if (index + 1 >= deck.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function restart(onlyLearning = false) {
    const base = onlyLearning ? items.filter((i) => learning.includes(i.sn)) : items;
    setDeck(shuffle(base.length ? base : items));
    setIndex(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setFinished(false);
  }

  if (!deck.length) {
    return (
      <div className={`rounded-2xl border ${t.border} ${t.paper} ${t.shadow} p-10 text-center`}>
        <p className={`text-sm ${t.subtext}`}>No data available.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className={`rounded-2xl border ${t.border} ${t.paper} ${t.shadow} p-6 sm:p-10 text-center`}>
        <p className={`text-lg font-semibold mb-2 ${t.text}`}>Session complete 🎉</p>
        <p className={`text-sm mb-6 ${t.subtext}`}>
          Known: <span className="text-emerald-500 font-semibold">{known.length}</span> · Still
          learning: <span className="text-rose-500 font-semibold">{learning.length}</span>
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => restart(false)}
            className={`text-sm px-4 py-2 rounded-full ${t.accentBg} text-white shadow-sm`}
          >
            Restart Full Deck
          </button>
          {learning.length > 0 && (
            <button
              onClick={() => restart(true)}
              className={`text-sm px-4 py-2 rounded-full border ${t.border} ${t.text}`}
            >
              Practice Weak Words ({learning.length})
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`h-1.5 rounded-full ${t.accentBgSoft} mb-5 overflow-hidden`}>
        <div
          className={`h-full ${t.accentBg} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className={`flex justify-between text-xs mb-3 ${t.subtext}`}>
        <span>
          Card {index + 1} of {deck.length}
        </span>
        <span>
          ✓ <span className="text-emerald-500">{known.length}</span> &nbsp; ✎{" "}
          <span className="text-rose-500">{learning.length}</span>
        </span>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className={`rounded-2xl border ${t.border} ${t.paper} ${t.shadow} cursor-pointer select-none min-h-[220px] flex flex-col items-center justify-center px-5 sm:px-6 py-8 sm:py-10 text-center transition ${
          current?.highlight ? t.highlightRing : ""
        }`}
      >
        {current?.highlight && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold mb-2 ${t.highlightBadge}`}
          >
            ⭐ Needs revision
          </span>
        )}
        {!flipped ? (
          <>
            <span className={`text-xs uppercase tracking-wide mb-3 ${t.subtext}`}>
              #{current.sn} · Tap to reveal
            </span>
            <span
              className={`text-xl sm:text-2xl font-semibold ${
                current.highlight ? t.highlightTerm : t.accent
              }`}
            >
              {current.term}
            </span>
            {current.pos && (
              <span className={`text-xs mt-1 ${t.subtext}`}>({current.pos})</span>
            )}
          </>
        ) : (
          <>
            <p className={`text-base ${t.text} mb-2`}>{current.meaning}</p>
            {current.hindi && (
              <p className={`text-sm font-medium ${t.hindiText} mb-2`}>{current.hindi}</p>
            )}
            {current.tip && (
              <p className={`text-xs italic ${t.subtext}`}>💡 {current.tip}</p>
            )}
          </>
        )}
      </div>

      {flipped && (
        <div className="flex gap-3 justify-center mt-5">
          <button
            onClick={() => handleAnswer(false)}
            className="text-sm px-5 py-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition shadow-sm"
          >
            ✎ Still Learning
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="text-sm px-5 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm"
          >
            ✓ I Knew It
          </button>
        </div>
      )}

      {!flipped && (
        <p className={`text-center text-xs mt-4 ${t.subtext}`}>
          Click the card to reveal the meaning
        </p>
      )}
    </div>
  );
}
