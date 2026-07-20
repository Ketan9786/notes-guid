import React, { useState } from 'react';

export default function RuleBookTab({ rules }) {
  const [pageIndex, setPageIndex] = useState(0);
  const rule = rules[pageIndex];
  const totalPages = rules.length;

  const goPrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const goNext = () => setPageIndex((i) => Math.min(totalPages - 1, i + 1));
  const goToPage = (n) => {
    const idx = Math.min(Math.max(0, n - 1), totalPages - 1);
    setPageIndex(idx);
  };

  if (!rule) return null;

  return (
    <div className="rule-page-container">
      <div className="rule-card">
        <div className="rule-card-header">
          <span className="rule-number">Rule {String(rule.id).padStart(2, '0')}</span>
          <span className="rule-page-ref">Page {rule.page}</span>
        </div>

        <h2 className="rule-title">{rule.title}</h2>

        <p className="rule-text">{rule.ruleText}</p>

        {rule.structure && (
          <div className="rule-structure">
            <strong>Structure:-</strong>
            <p>{rule.structure}</p>
          </div>
        )}

        {rule.points && rule.points.length > 0 && (
          <ul className="rule-points">
            {rule.points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        )}

        {rule.wordList && rule.wordList.length > 0 && (
          <div className="rule-wordlist">
            <strong>Word list:-</strong>
            <p>{rule.wordList.join(', ')}</p>
          </div>
        )}

        {rule.note && (
          <div className="rule-note">
            <strong>Note:-</strong> {rule.note}
          </div>
        )}

        {rule.examples && rule.examples.length > 0 && (
          <div className="rule-examples">
            <strong>e.g.</strong>
            <ul>
              {rule.examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {rule.questions && rule.questions.length > 0 && (
          <div className="rule-questions">
            <strong>Practice Questions:-</strong>
            <ol>
              {rule.questions.map((q, i) => (
                <li key={i}>
                  <p>{q.q}</p>
                  {q.source && <span className="q-source">[{q.source}]</span>}
                </li>
              ))}
            </ol>
            <details className="answer-key">
              <summary>Answer Key</summary>
              <p>
                {rule.questions.map((q, i) => (
                  <span key={i}>{i + 1}. ({q.answer}) &nbsp;</span>
                ))}
              </p>
            </details>
          </div>
        )}
      </div>

      <div className="pagination-bar">
        <button onClick={goPrev} disabled={pageIndex === 0} className="page-btn">
          Prev
        </button>

        <span className="page-indicator">
          Rule {pageIndex + 1} of {totalPages}
        </span>

        <input
          type="number"
          min={1}
          max={totalPages}
          value={pageIndex + 1}
          onChange={(e) => goToPage(Number(e.target.value))}
          className="page-jump-input"
        />

        <button onClick={goNext} disabled={pageIndex === totalPages - 1} className="page-btn">
          Next
        </button>
      </div>
    </div>
  );
}
