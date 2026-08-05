import React, { useMemo, useState } from "react";

/**
 * PracticeSetup.jsx
 * A reusable "topic selection" screen for any category-based practice/quiz module
 * (Error Detection today, but built generically so it can be reused for other
 * modules like Vocabulary, Idioms, Reading Comprehension, etc. in the future).
 *
 * Expects JSON in the shape:
 * {
 *   categories: [
 *     { category: "Noun", questions: [ {...}, {...} ] },
 *     { category: "Verb", questions: [ {...}, ... ] },
 *     ...
 *   ]
 * }
 *
 * Renders a topic picker + question-count selector + "Start Test" button.
 * On start, it builds a filtered/shuffled dataset (same shape as input) and
 * calls onStart(filteredData) so the parent can hand it off to <Test />.
 *
 * Usage:
 *   import PracticeSetup from "./PracticeSetup";
 *   import Test from "./Test";
 *   import quizData from "./spot_the_error_by_pos_506.json";
 *
 *   function ErrorDetectionPage() {
 *     const [practiceData, setPracticeData] = useState(null);
 *     if (!practiceData) {
 *       return (
 *         <PracticeSetup
 *           data={quizData}
 *           title="Error Detection"
 *           onStart={(filtered) => setPracticeData(filtered)}
 *         />
 *       );
 *     }
 *     return <Test data={practiceData} durationMinutes={60} />;
 *   }
 */

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const COUNT_PRESETS = [10, 20, 30, 50, "All"];

export default function PracticeSetup({ data, title = "Practice", onStart }) {
  const categories = data?.categories || [];

  const totalQuestions = useMemo(
    () => categories.reduce((sum, c) => sum + c.questions.length, 0),
    [categories]
  );

  const [selectedTopics, setSelectedTopics] = useState(["All"]);
  const [questionCount, setQuestionCount] = useState("All");
  const [shuffle, setShuffle] = useState(true);

  const isAllSelected = selectedTopics.includes("All");

  const toggleTopic = (topicName) => {
    if (topicName === "All") {
      setSelectedTopics(["All"]);
      return;
    }
    setSelectedTopics((prev) => {
      const withoutAll = prev.filter((t) => t !== "All");
      if (withoutAll.includes(topicName)) {
        const next = withoutAll.filter((t) => t !== topicName);
        return next.length === 0 ? ["All"] : next;
      }
      return [...withoutAll, topicName];
    });
  };

  const availableQuestionCount = useMemo(() => {
    if (isAllSelected) return totalQuestions;
    return categories
      .filter((c) => selectedTopics.includes(c.category))
      .reduce((sum, c) => sum + c.questions.length, 0);
  }, [categories, selectedTopics, isAllSelected, totalQuestions]);

  const handleStart = () => {
    const chosenCategories = isAllSelected
      ? categories
      : categories.filter((c) => selectedTopics.includes(c.category));

    const limit =
      questionCount === "All" ? Infinity : Number(questionCount);

    // Build a flat pool tagged with category, optionally shuffle, then cap to limit
    let pool = chosenCategories.flatMap((c) =>
      c.questions.map((q) => ({ ...q, __category: c.category }))
    );
    if (shuffle) pool = shuffleArray(pool);
    if (Number.isFinite(limit)) pool = pool.slice(0, limit);

    // Re-group back into { categories: [{ category, questions }] } shape
    const grouped = {};
    pool.forEach((q) => {
      const catName = q.__category;
      if (!grouped[catName]) grouped[catName] = [];
      const { __category, ...rest } = q;
      grouped[catName].push(rest);
    });

    const filteredData = {
      categories: Object.entries(grouped).map(([category, questions]) => ({
        category,
        questions,
      })),
    };

    onStart(filteredData);
  };

  const startDisabled = availableQuestionCount === 0;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{title} — Choose Your Practice</h2>
        <p style={styles.subtitle}>
          Select one or more topics, choose how many questions you want, then start.
        </p>

        <div style={styles.section}>
          <h4 style={styles.sectionLabel}>Select Topic(s)</h4>
          <div style={styles.topicGrid}>
            <button
              style={{
                ...styles.topicChip,
                ...(isAllSelected ? styles.topicChipActive : {}),
              }}
              onClick={() => toggleTopic("All")}
            >
              All Topics
              <span style={styles.countBadge}>{totalQuestions}</span>
            </button>
            {categories.map((c) => {
              const active = !isAllSelected && selectedTopics.includes(c.category);
              return (
                <button
                  key={c.category}
                  style={{
                    ...styles.topicChip,
                    ...(active ? styles.topicChipActive : {}),
                  }}
                  onClick={() => toggleTopic(c.category)}
                >
                  {c.category}
                  <span style={styles.countBadge}>{c.questions.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionLabel}>Number of Questions</h4>
          <div style={styles.countRow}>
            {COUNT_PRESETS.map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                disabled={n !== "All" && n > availableQuestionCount}
                style={{
                  ...styles.countChip,
                  ...(questionCount === n ? styles.countChipActive : {}),
                  opacity: n !== "All" && n > availableQuestionCount ? 0.4 : 1,
                }}
              >
                {n === "All" ? `All (${availableQuestionCount})` : n}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.shuffleLabel}>
            <input
              type="checkbox"
              checked={shuffle}
              onChange={(e) => setShuffle(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Shuffle questions
          </label>
        </div>

        <div style={styles.summary}>
          You are about to practice{" "}
          <strong>
            {questionCount === "All" ? availableQuestionCount : Math.min(Number(questionCount), availableQuestionCount)}
          </strong>{" "}
          question(s) from{" "}
          <strong>{isAllSelected ? "All Topics" : selectedTopics.join(", ")}</strong>.
        </div>

        <button
          style={{ ...styles.startBtn, opacity: startDisabled ? 0.5 : 1 }}
          onClick={handleStart}
          disabled={startDisabled}
        >
          Start Test →
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Inter, system-ui, sans-serif",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 40,
    backgroundColor: "#f7f8fa",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    padding: 32,
  },
  title: { fontSize: 24, fontWeight: 800, margin: 0, color: "#1a1a1a" },
  subtitle: { color: "#666", marginTop: 6, marginBottom: 24, fontSize: 14 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#333" },
  topicGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
  topicChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 20,
    border: "1.5px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#333",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  topicChipActive: {
    backgroundColor: "#2563eb",
    color: "#fff",
    borderColor: "#2563eb",
  },
  countBadge: {
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    padding: "1px 8px",
    fontSize: 12,
  },
  countRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  countChip: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    backgroundColor: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  countChipActive: {
    backgroundColor: "#111827",
    color: "#fff",
    borderColor: "#111827",
  },
  shuffleLabel: { fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", cursor: "pointer" },
  summary: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 24,
  },
  startBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#16a34a",
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
};
