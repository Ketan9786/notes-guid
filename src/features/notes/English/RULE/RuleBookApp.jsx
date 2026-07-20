import { useState } from 'react';
import RuleBookTab from './RuleBookTab';
import QuickRevisionTab from './QuickRevisionTab';
import rulesData from './rules.json';
import quickData from './quickRevision.json';
import './RuleBook.css';

export default function RuleBookApp() {
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <div className="rulebook-app">
      <header className="rulebook-header">
        <h1>{rulesData.bookTitle}</h1>
        <p className="rulebook-author">by {rulesData.author}</p>
      </header>

      <nav className="tab-nav">
        <button
          className={activeTab === 'rules' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('rules')}
        >
          All Rules
        </button>
        <button
          className={activeTab === 'quick' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('quick')}
        >
          Quick Revision
        </button>
      </nav>

      <main className="tab-content">
        {activeTab === 'rules' && <RuleBookTab rules={rulesData.rules} />}
        {activeTab === 'quick' && <QuickRevisionTab quickRules={quickData.quickRules} />}
      </main>
    </div>
  );
}
