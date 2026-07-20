import React, { useState } from "react";
import vocabData from "../../../../data/english/vocabulary/vocabulary.json";
import "./VocabularyTable.css";

const VocabularyTable = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [modalWord, setModalWord] = useState(null);
  const [useModal, setUseModal] = useState(false); // toggle: false = expand row, true = modal

  const words = vocabData.words;

  const handleRowClick = (word) => {
    if (useModal) {
      setModalWord(word);
    } else {
      setExpandedId(expandedId === word.id ? null : word.id);
    }
  };

  const closeModal = () => setModalWord(null);

  return (
    <div className="vocab-container">
      <div className="vocab-header">
        <h2>Vocabulary Builder ({vocabData.totalWords} words)</h2>
        <label className="toggle-mode">
          <input
            type="checkbox"
            checked={useModal}
            onChange={(e) => setUseModal(e.target.checked)}
          />
          Open details in Modal (uncheck for expandable row)
        </label>
      </div>

      <table className="vocab-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Hindi Meaning</th>
            <th>Part of Speech</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w, idx) => (
            <React.Fragment key={w.id}>
              <tr
                className={`vocab-row ${expandedId === w.id ? "active-row" : ""}`}
                onClick={() => handleRowClick(w)}
              >
                <td>{idx + 1}</td>
                <td className="word-cell">{w.word}</td>
                <td>{w.hindiMeaning}</td>
                <td>{w.partOfSpeech || "-"}</td>
              </tr>

              {!useModal && expandedId === w.id && (
                <tr className="details-row">
                  <td colSpan="4">
                    <WordDetails word={w} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {useModal && modalWord && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            <WordDetails word={modalWord} />
          </div>
        </div>
      )}
    </div>
  );
};

const WordDetails = ({ word }) => {
  return (
    <div className="word-details">
      <div className="details-title">
        <h3>
          {word.word}{" "}
          <span className="hindi-title">({word.hindiMeaning})</span>
        </h3>
        {word.clusterCategory && (
          <span className="cluster-tag">{word.clusterCategory}</span>
        )}
      </div>

      {word.context && <p className="context-text">{word.context}</p>}

      <div className="syn-ant-grid">
        {word.synonyms && word.synonyms.length > 0 && (
          <div className="syn-block">
            <h4>Synonyms</h4>
            <ul>
              {word.synonyms.map((s, i) => (
                <li key={i}>
                  <strong>{s.word}</strong>
                  {s.hindiMeaning ? ` (${s.hindiMeaning})` : ""}
                  {s.context ? ` — ${s.context}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {word.antonyms && word.antonyms.length > 0 && (
          <div className="ant-block">
            <h4>Antonyms</h4>
            <ul>
              {word.antonyms.map((a, i) => (
                <li key={i}>
                  <strong>{a.word}</strong>
                  {a.hindiMeaning ? ` (${a.hindiMeaning})` : ""}
                  {a.context ? ` — ${a.context}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {word.mnemonic && (word.mnemonic.english || word.mnemonic.hindi) && (
        <div className="mnemonic-block">
          <h4>🧠 Memory Trick</h4>
          {word.mnemonic.english && (
            <p className="mnemonic-en">{word.mnemonic.english}</p>
          )}
          {word.mnemonic.hindi && (
            <p className="mnemonic-hi">{word.mnemonic.hindi}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyTable;
