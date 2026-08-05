import React, { useState } from "react";
import PracticeSetup from "./PracticeSetup";
import Test from "../../../../component/practice/Test";
import data from "../../../../data/english/practice/spot_the_error_by_pos_506.json"

/**
 * ErrorDetection.jsx
 * A reusable, common "topic-select -> practice" wrapper component.
 * Combines <PracticeSetup /> (topic + question-count selection screen)
 * with <Test /> (the actual exam-style practice UI).
 *
 * This pattern is designed to be generic: the same PracticeSetup + Test
 * combo can be reused for other modules in the future (Vocabulary,
 * Idioms, Reading Comprehension, etc.) simply by passing different JSON
 * data and a different title/durationMinutes.
 *
 * Usage:
 *   import ErrorDetection from "./ErrorDetection";
 *   import quizData from "./spot_the_error_by_pos_506.json";
 *
 *   function App() {
 *     return <ErrorDetection data={quizData} />;
 *   }
 */

export default function ErrorDetection({ title = "Error Detection", durationMinutes = 60 }) {
  const [practiceData, setPracticeData] = useState(null);

  const handleRestart = () => setPracticeData(null);

  if (!practiceData) {
    return (
      <PracticeSetup
        data={data}
        title={title}
        onStart={(filteredData) => setPracticeData(filteredData)}
      />
    );
  }

  return (
    <div>
      <div style={{ padding: "10px 24px" }}>
        <button
          onClick={handleRestart}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#111827",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Change Topic / Settings
        </button>
      </div>
      <Test data={practiceData} durationMinutes={durationMinutes} />
    </div>
  );
}
