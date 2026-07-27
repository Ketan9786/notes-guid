import React, { useState, useMemo } from "react";
import "./StudyDeck2.css";

// Normalizes different JSON shapes (synonyms/antonyms/vocabulary files) into one object
const normalizeWord = (w, idx) => ({
  id: w.id ?? w.sn ?? idx + 1,
  sn: w.sn ?? w.id ?? idx + 1,
  word: w.word,
  pos: w.pos ?? w.partOfSpeech ?? "-",
  hindi: w.hindi ?? w.hindiMeaning ?? "-",
  meaning: w.meaning ?? w.context ?? "",
  clusterCategory: w.clusterCategory,
  repetitionSSC: w.repetitionSSC,
  repetitionOther: w.repetitionOther,
  synonyms: (w.synonyms || []).map((s) => ({
    word: s.word,
    hindi: s.hindi ?? s.hindiMeaning ?? "",
    extra: !!s.extra,
    context: s.context ?? "",
  })),
  antonyms: (w.antonyms || []).map((a) => ({
    word: a.word,
    hindi: a.hindi ?? a.hindiMeaning ?? "",
    extra: !!a.extra,
    context: a.context ?? "",
  })),
  mnemonic: w.mnemonic,
});

const StudyDeck2 = ({ data, tableHeader }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [modalWord, setModalWord] = useState(null);
  const [useModal, setUseModal] = useState(false);
  const [search, setSearch] = useState("");

  const words = useMemo(
    () => (data.words || []).map((w, i) => normalizeWord(w, i)),
    [data.words]
  );

  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;
    const q = search.trim().toLowerCase();
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.hindi.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
    );
  }, [words, search]);

  const title = data.title || "Study Deck";
  const total = data.totalWords ?? words.length;

  const handleRowClick = (word) => {
    if (useModal) setModalWord(word);
    else setExpandedId(expandedId === word.id ? null : word.id);
  };

  const closeModal = () => setModalWord(null);

  const headers =
    tableHeader && tableHeader.length === 4
      ? tableHeader
      : ["#", "Word", "Hindi Meaning", "Part of Speech"];

  return (
    <div className="vocab-container">
      <div className="vocab-header">
        <h2>
          {title} ({filteredWords.length}/{total} words)
        </h2>
        <div className="header-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search word, hindi, meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="toggle-mode">
            <input
              type="checkbox"
              checked={useModal}
              onChange={(e) => setUseModal(e.target.checked)}
            />
            Open details in Modal (uncheck for expandable row)
          </label>
        </div>
      </div>

      <table className="vocab-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredWords.map((w, idx) => (
            <React.Fragment key={w.id}>
              <tr
                className={`vocab-row ${expandedId === w.id ? "active-row" : ""}`}
                onClick={() => handleRowClick(w)}
              >
                <td>{idx + 1}</td>
                <td className="word-cell">{w.word}</td>
                <td>{w.hindi}</td>
                <td>{w.pos}</td>
              </tr>

              {!useModal && expandedId === w.id && (
                <tr className="details-row">
                  <td colSpan={headers.length}>
                    <WordDetails word={w} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}

          {filteredWords.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="no-results">
                No matching words found.
              </td>
            </tr>
          )}
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

const WordDetails = ({ word }) => (
  <div className="word-details">
    <div className="details-title">
      <h3>
        {word.word} <span className="hindi-title">({word.hindi})</span>
      </h3>
      {word.clusterCategory && (
        <span className="cluster-tag">{word.clusterCategory}</span>
      )}
    </div>

    {word.meaning && <p className="context-text">{word.meaning}</p>}

    {(word.repetitionSSC != null || word.repetitionOther != null) && (
      <p className="repetition-text">
        Asked in SSC: <strong>{word.repetitionSSC ?? 0}</strong> | Other exams:{" "}
        <strong>{word.repetitionOther ?? 0}</strong>
      </p>
    )}

    <div className="syn-ant-grid">
      {word.synonyms.length > 0 && (
        <div className="syn-block">
          <h4>Synonyms</h4>
          <ul>
            {word.synonyms.map((s, i) => (
              <li key={i} className={s.extra ? "extra-item" : ""}>
                <strong>{s.word}</strong>
                {s.hindi ? ` (${s.hindi})` : ""}
                {s.context ? ` — ${s.context}` : ""}
                {s.extra ? <span className="extra-tag">extra</span> : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {word.antonyms.length > 0 && (
        <div className="ant-block">
          <h4>Antonyms</h4>
          <ul>
            {word.antonyms.map((a, i) => (
              <li key={i} className={a.extra ? "extra-item" : ""}>
                <strong>{a.word}</strong>
                {a.hindi ? ` (${a.hindi})` : ""}
                {a.context ? ` — ${a.context}` : ""}
                {a.extra ? <span className="extra-tag">extra</span> : ""}
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

export default StudyDeck2;