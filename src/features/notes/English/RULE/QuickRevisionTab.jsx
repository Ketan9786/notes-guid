import React from 'react';

export default function QuickRevisionTab({ quickRules }) {
  return (
    <div className="quick-revision-container">
      <p className="quick-revision-hint">
        Scroll through for a fast one-line recap of every rule. Open "All Rules" tab for full details.
      </p>
      <div className="quick-scroll-list">
        {quickRules.map((qr) => (
          <div key={qr.id} className="quick-item">
            <span className="quick-rule-num">R{String(qr.id).padStart(2, '0')}</span>
            <div className="quick-item-body">
              <h4>{qr.title}</h4>
              <p>{qr.oneLiner}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
