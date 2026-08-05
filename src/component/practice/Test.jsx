import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Test.jsx
 * Full exam-style "Spot the Error" practice UI (SSC/PYQ pattern), similar to
 * official mock-test interfaces: numbered question palette, timer, MCQ options,
 * instant right/wrong feedback + explanation on click.
 *
 * Expects JSON in the shape:
 * {
 *   categories: [
 *     { category: "Noun", questions: [{ id, sentence, error_part, correction, explanation }, ...] },
 *     ...
 *   ]
 * }
 *
 * Usage:
 *   import Test from "./Test";
 *   import quizData from "./spot_the_error_by_pos_506.json";
 *   <Test data={quizData} durationMinutes={60} />
 */

// ---------- Helpers: split a sentence into 3-4 "parts" like the real exam ----------
function splitIntoParts(sentence) {
  // Prefer splitting on commas first
  let parts = sentence.split(/(?<=,)\s+/).filter(Boolean);
  if (parts.length < 2) {
    // fallback: split into ~3 roughly equal word chunks
    const words = sentence.split(" ");
    const chunkSize = Math.ceil(words.length / 3);
    parts = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      parts.push(words.slice(i, i + chunkSize).join(" "));
    }
  }
  // cap at 4 parts max, merge overflow into last part
  if (parts.length > 4) {
    const head = parts.slice(0, 3);
    const tail = parts.slice(3).join(" ");
    parts = [...head, tail];
  }
  return parts.filter((p) => p.trim().length > 0);
}

// Safely coerce error_part to a usable string or null
function normalizeErrorPart(error_part) {
  if (typeof error_part === "string" && error_part?.trim().length > 0) {
    const trimmed = error_part?.trim();
    return trimmed.toLowerCase() === "no error" ? null : trimmed;
  }
  return null; // null, undefined, non-string, or empty -> treated as "No error"
}

function buildOptions(question) {
  const { sentence } = question;
  const errorPart = normalizeErrorPart(question.error_part);
  const parts = splitIntoParts(sentence);
  const hasError = !!errorPart;

  let options = [];
  if (hasError) {
    const errSnippet = errorPart.toLowerCase().slice(0, Math.min(8, errorPart.length));
    const matchedIdx = parts.findIndex((p) => p.toLowerCase().includes(errSnippet));
    options = matchedIdx >= 0 ? [...parts] : [...parts, errorPart];
    options.push("No error");
  } else {
    options = [...parts, "No error"];
  }

  // Deduplicate & cap to max 4 options, always keep "No error"
  const unique = Array.from(new Set(options.map((o) => String(o).trim())));
  let finalOptions = unique.slice(0, 4);
  if (!finalOptions.includes("No error")) {
    finalOptions[finalOptions.length - 1] = "No error";
  }
  return finalOptions;
}

function getCorrectOption(question, options) {
  const errorPart = normalizeErrorPart(question.error_part);
  if (!errorPart) return "No error";
  const errSnippet = errorPart.toLowerCase().slice(0, Math.min(8, errorPart.length));
  const found = options.find(
    (o) =>
      o.toLowerCase().includes(errSnippet) ||
      errorPart.toLowerCase().includes(o.toLowerCase())
  );
  return found || options[0];
}

// ---------- Timer ----------
function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return { seconds, display: `${mm}:${ss.toString().padStart(2, "0")}` };
}

export default function Test({ data, durationMinutes = 60 }) {
  const allQuestions = useMemo(() => {
    const cats = data?.categories || [];
    return cats.flatMap((c) =>
      c.questions.map((q) => ({ ...q, category: c.category }))
    );
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIndex: { selected, isCorrect } }
  const [marked, setMarked] = useState({}); // { qIndex: true }
  const [submitted, setSubmitted] = useState(false);
  const { seconds, display } = useCountdown(durationMinutes * 60);

  const current = allQuestions[currentIndex];
  const options = useMemo(() => (current ? buildOptions(current) : []), [current]);
  const correctOption = useMemo(
    () => (current ? getCorrectOption(current, options) : null),
    [current, options]
  );

  const currentAnswer = answers[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const handleSelect = useCallback(
    (option) => {
      if (currentAnswer) return; // lock after first click, like real exams
      const isCorrect = option === correctOption;
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: { selected: option, isCorrect },
      }));
    },
    [currentAnswer, correctOption, currentIndex]
  );

  const goTo = (idx) => {
    if (idx >= 0 && idx < allQuestions.length) setCurrentIndex(idx);
  };

  const toggleMark = () => {
    setMarked((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleSubmit = () => setSubmitted(true);

  const score = useMemo(() => {
    const correct = Object.values(answers).filter((a) => a.isCorrect).length;
    return { correct, attempted: answeredCount, total: allQuestions.length };
  }, [answers, answeredCount, allQuestions.length]);

  if (!current) return <div style={styles.container}>No questions available.</div>;

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.resultCard}>
          <h2>Test Submitted ✅</h2>
          <p style={{ fontSize: 18 }}>
            Score: <strong>{score.correct}</strong> / {score.total}
          </p>
          <p>Attempted: {score.attempted} / {score.total}</p>
          <button style={styles.navBtn} onClick={() => setSubmitted(false)}>
            Review Answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.topBtn} onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          style={{ ...styles.topBtn, backgroundColor: marked[currentIndex] ? "#f0ad4e" : "#7c93c9" }}
          onClick={toggleMark}
        >
          Mark for Review
        </button>
        <button
          style={styles.topBtn}
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === allQuestions.length - 1}
        >
          Save &amp; Next
        </button>
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Submit Test
        </button>

        <div style={styles.rightInfo}>
          <div>
            Total Questions answered: <span style={styles.answeredBadge}>{answeredCount}</span>
          </div>
          <div style={styles.timer}>
            Last <span style={{ color: "#2563eb" }}>{display}</span> Minutes
          </div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Left palette */}
        <div style={styles.palette}>
          <h3 style={styles.paletteTitle}>Error Detection</h3>
          <div style={styles.grid}>
            {allQuestions.map((_, idx) => {
              const answered = answers[idx];
              const isMarked = marked[idx];
              let bg = "#2563eb"; // default not visited
              if (idx === currentIndex) bg = "#0b3d91";
              else if (answered) bg = answered.isCorrect ? "#16a34a" : "#dc2626";
              else if (isMarked) bg = "#f0ad4e";
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  style={{ ...styles.paletteBtn, backgroundColor: bg }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question panel */}
        <div style={styles.questionPanel}>
          <div style={styles.questionHeader}>
            <strong>Question No. {currentIndex + 1}</strong>
            <span style={styles.langSelect}>
              Select Language:{" "}
              <select defaultValue="English">
                <option>English</option>
              </select>
            </span>
          </div>

          <div style={styles.questionBox}>
            <p style={styles.instruction}>
              Find the part of the given sentence that has an error in it. If there is no error,
              choose &apos;No error&apos;.
            </p>
            <p style={styles.sentence}>{current.sentence}</p>

            <div style={styles.optionsList}>
              {options.map((opt, i) => {
                const isSelected = currentAnswer?.selected === opt;
                const isCorrectOpt = opt === correctOption;
                let borderColor = "#ccc";
                let bg = "#fff";
                if (currentAnswer) {
                  if (isCorrectOpt) {
                    bg = "#e6f4ea";
                    borderColor = "#16a34a";
                  } else if (isSelected && !isCorrectOpt) {
                    bg = "#fdecea";
                    borderColor = "#dc2626";
                  }
                }
                return (
                  <label
                    key={i}
                    style={{
                      ...styles.optionRow,
                      backgroundColor: bg,
                      borderColor,
                      cursor: currentAnswer ? "default" : "pointer",
                    }}
                    onClick={() => handleSelect(opt)}
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                      style={{ marginRight: 12 }}
                    />
                    {opt}
                    {currentAnswer && isCorrectOpt && (
                      <span style={styles.tickMark}>✔</span>
                    )}
                    {currentAnswer && isSelected && !isCorrectOpt && (
                      <span style={styles.crossMark}>✘</span>
                    )}
                  </label>
                );
              })}
            </div>

            {currentAnswer && (
              <div
                style={{
                  ...styles.explanationBox,
                  borderColor: currentAnswer.isCorrect ? "#16a34a" : "#dc2626",
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, color: currentAnswer.isCorrect ? "#16a34a" : "#dc2626" }}>
                  {currentAnswer.isCorrect ? "✅ Correct!" : "❌ Incorrect."}
                </p>
                {current.correction && (
                  <p style={{ marginTop: 8 }}>
                    <strong>Correction:</strong> {current.correction}
                  </p>
                )}
                <p style={{ marginTop: 4 }}>
                  <strong>Explanation:</strong> {current.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "Inter, system-ui, sans-serif", color: "#1a1a1a", minHeight: "100vh" },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderBottom: "1px solid #e0e0e0",
    flexWrap: "wrap",
  },
  topBtn: {
    padding: "8px 18px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#7c93c9",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "8px 18px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#1a9c4b",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  rightInfo: { marginLeft: "auto", textAlign: "right", fontWeight: 600 },
  answeredBadge: { backgroundColor: "#fff59d", padding: "2px 8px", borderRadius: 4 },
  timer: { fontSize: 20, fontWeight: 800, color: "#dc2626" },
  body: { display: "flex", padding: 24, gap: 32 },
  palette: { minWidth: 280 },
  paletteTitle: { marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 44px)", gap: 12 },
  paletteBtn: {
    width: 44,
    height: 34,
    borderRadius: 6,
    border: "none",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  questionPanel: { flex: 1, borderLeft: "1px solid #e0e0e0", paddingLeft: 32 },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  langSelect: { fontSize: 14 },
  questionBox: { border: "1px solid #e0e0e0", borderRadius: 8, padding: 24 },
  instruction: { fontSize: 15, marginBottom: 16 },
  sentence: { fontSize: 18, fontWeight: 700, marginBottom: 20 },
  optionsList: { display: "flex", flexDirection: "column", gap: 12 },
  optionRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 16,
    position: "relative",
    transition: "background-color 0.2s, border-color 0.2s",
  },
  tickMark: { marginLeft: "auto", color: "#16a34a", fontWeight: 800, fontSize: 18 },
  crossMark: { marginLeft: "auto", color: "#dc2626", fontWeight: 800, fontSize: 18 },
  explanationBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    border: "2px solid #ccc",
    backgroundColor: "#fafafa",
    fontSize: 15,
    lineHeight: 1.6,
  },
  container: { maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "Inter, sans-serif" },
  resultCard: { textAlign: "center", padding: 60 },
  navBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 20,
  },
};
