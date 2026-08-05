import  { useState, useEffect, useMemo } from "react";

/**
 * SpotTheErrorPractice.jsx
 * A React component to practice "Spot the Error" PYQ (Previous Year Questions).
 * Consumes the JSON structure:
 * {
 *   categories: [
 *     {
 *       category: "Noun",
 *       questions: [
 *         { id, sentence, error_part, correction, explanation }
 *       ]
 *     }, ...
 *   ]
 * }
 *
 * Usage:
 *   import SpotTheErrorPractice from "./SpotTheErrorPractice";
 *   import quizData from "./spot_the_error_by_pos.json";
 *   <SpotTheErrorPractice data={quizData} />
 */

export default function SpotTheErrorPractice({ data }) {
  const categories = data?.categories || [];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [userGuess, setUserGuess] = useState("");
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null

  // Flatten questions based on selected category
  const questions = useMemo(() => {
    if (selectedCategory === "All") {
      return categories.flatMap((c) =>
        c.questions.map((q) => ({ ...q, category: c.category }))
      );
    }
    const cat = categories.find((c) => c.category === selectedCategory);
    return cat ? cat.questions.map((q) => ({ ...q, category: cat.category })) : [];
  }, [categories, selectedCategory]);

  const current = questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setUserGuess("");
    setFeedback(null);
  }, [selectedCategory]);

  if (!current) {
    return (
      <div style={styles.container}>
        <p>No questions available.</p>
      </div>
    );
  }

  const hasError = !!current.error_part;

  const handleCheck = () => {
    if (!userGuess.trim()) return;
    const normalizedGuess = userGuess.trim().toLowerCase();
    const normalizedAnswer = (current.error_part || "no error").trim().toLowerCase();
    const isCorrect =
      normalizedGuess === normalizedAnswer ||
      (!hasError && normalizedGuess.includes("no error"));

    setFeedback(isCorrect ? "correct" : "wrong");
    setShowAnswer(true);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      attempted: prev.attempted + 1,
    }));
  };

  const goNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    setShowAnswer(false);
    setUserGuess("");
    setFeedback(null);
  };

  const goPrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setShowAnswer(false);
    setUserGuess("");
    setFeedback(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Spot the Error — PYQ Practice</h2>
        <div style={styles.scoreBadge}>
          Score: {score.correct} / {score.attempted}
        </div>
      </div>

      <div style={styles.controls}>
        <label style={styles.label}>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category} ({c.questions.length})
            </option>
          ))}
        </select>

        <span style={styles.counter}>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div style={styles.card}>
        <div style={styles.categoryTag}>{current.category}</div>
        <p style={styles.sentence}>{current.sentence}</p>

        <div style={styles.inputRow}>
          <input
            type="text"
            placeholder='Type the error part (or "No error")'
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            style={styles.input}
            disabled={showAnswer}
          />
          <button
            onClick={handleCheck}
            disabled={showAnswer || !userGuess.trim()}
            style={styles.checkBtn}
          >
            Check
          </button>
        </div>

        {feedback && (
          <div
            style={{
              ...styles.feedback,
              backgroundColor: feedback === "correct" ? "#e6f4ea" : "#fdecea",
              color: feedback === "correct" ? "#1e7e34" : "#c62828",
            }}
          >
            {feedback === "correct" ? "✅ Correct!" : "❌ Not quite."}
          </div>
        )}

        {showAnswer && (
          <div style={styles.answerBox}>
            <p>
              <strong>Error part:</strong>{" "}
              {current.error_part ? current.error_part : "No error"}
            </p>
            <p>
              <strong>Correction:</strong> {current.correction}
            </p>
            <p style={styles.explanation}>
              <strong>Explanation:</strong> {current.explanation}
            </p>
          </div>
        )}
      </div>

      <div style={styles.navRow}>
        <button onClick={goPrev} disabled={currentIndex === 0} style={styles.navBtn}>
          ← Previous
        </button>
        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            style={{ ...styles.navBtn, backgroundColor: "#f0ad4e" }}
          >
            Reveal Answer
          </button>
        )}
        <button
          onClick={goNext}
          disabled={currentIndex === questions.length - 1}
          style={styles.navBtn}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#1a1a1a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  scoreBadge: {
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  label: { fontSize: 14, fontWeight: 600 },
  select: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  counter: { fontSize: 13, color: "#666", marginLeft: "auto" },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    marginBottom: 16,
  },
  categoryTag: {
    display: "inline-block",
    backgroundColor: "#f5f5f5",
    padding: "3px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: 12,
  },
  sentence: { fontSize: 17, lineHeight: 1.6, marginBottom: 16 },
  inputRow: { display: "flex", gap: 8 },
  input: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  checkBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  feedback: {
    marginTop: 12,
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
  },
  answerBox: {
    marginTop: 14,
    backgroundColor: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },
  explanation: { color: "#444" },
  navRow: { display: "flex", justifyContent: "space-between", gap: 10 },
  navBtn: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
