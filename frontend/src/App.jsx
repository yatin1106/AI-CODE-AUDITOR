import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: 'JS' },
  { id: 'typescript', label: 'TypeScript', icon: 'TS' },
  { id: 'python',     label: 'Python',     icon: 'PY' },
  { id: 'cpp',        label: 'C++',        icon: 'C++' },
  { id: 'c',          label: 'C',          icon: 'C' },
  { id: 'java',       label: 'Java',       icon: 'J' },
  { id: 'go',         label: 'Go',         icon: 'GO' },
  { id: 'rust',       label: 'Rust',       icon: 'RS' },
  { id: 'kotlin',     label: 'Kotlin',     icon: 'KT' },
  { id: 'swift',      label: 'Swift',      icon: 'SW' },
  { id: 'php',        label: 'PHP',        icon: 'PHP' },
  { id: 'ruby',       label: 'Ruby',       icon: 'RB' },
];

const EXT_MAP = {
  cpp: 'cpp', python: 'py', java: 'java', typescript: 'ts',
  c: 'c', go: 'go', rust: 'rs', kotlin: 'kt',
  swift: 'swift', php: 'php', ruby: 'rb', javascript: 'js'
};

function LanguageScreen({ onSelect }) {
  return (
    <div className="lang-screen">
      <div className="lang-header">
        <h1>AI CODE AUDITOR</h1>
        <p className="lang-subtitle">Select the language you want to audit</p>
      </div>
      <div className="lang-grid">
        {LANGUAGES.map((lang) => (
          <button key={lang.id} className="lang-card" onClick={() => onSelect(lang)}>
            <span className="lang-icon">{lang.icon}</span>
            <span className="lang-label">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AuditScreen({ language, onBack }) {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Code');

  const handleReview = async () => {
    if (!code) return;
    setLoading(true);
    setReview('Analyzing code...');
    try {
      const response = await fetch('https://ai-code-auditor-0oop.onrender.com/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: language.id })
      });
      const data = await response.text();
      setReview(data);
    } catch (err) {
      setReview("# Connection Error\nCheck if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const regex = new RegExp('```' + language.id + '([\\s\\S]*?)```');
    const codeMatch = review.match(regex);
    const textToCopy = codeMatch ? codeMatch[1].trim() : "";
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Code'), 2000);
    }
  };

  const scoreMatch = review.match(/Score: (\d+)\/10/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

  return (
    <div className="audit-app">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h1>AI CODE AUDITOR</h1>
          <span className="lang-badge">{language.label}</span>
        </div>
        <div className="nav-actions">
          <button className="run-btn" onClick={handleReview} disabled={loading}>
            {loading ? 'ANALYZING...' : 'RUN AUDIT'}
          </button>
        </div>
      </nav>

      <div className="workspace">
        <div className="editor-wrapper">
          <div className="terminal-bar">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">main.{EXT_MAP[language.id] || 'js'}</span>
          </div>
          <textarea
            className="editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your ${language.label} code here...`}
            spellCheck={false}
          />
        </div>

        <div className="results-pane">
          {review && (
            <div className="pane-controls">
              {score !== null && (
                <span className={`badge ${score < 5 ? 'danger' : score < 8 ? 'warning' : 'success'}`}>
                  {score < 5 ? 'CRITICAL' : score < 8 ? 'IMPROVABLE' : 'CLEAN'}
                </span>
              )}
              <button className="copy-btn" onClick={handleCopy}>{copyStatus}</button>
            </div>
          )}

          {!review && (
            <div className="empty-state">
              <span className="empty-icon">⚡</span>
              <p>Paste your {language.label} code and hit Run Audit</p>
            </div>
          )}

          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                }
              }}
            >
              {review}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedLang, setSelectedLang] = useState(null);

  if (!selectedLang) {
    return <LanguageScreen onSelect={setSelectedLang} />;
  }

  return <AuditScreen language={selectedLang} onBack={() => setSelectedLang(null)} />;
}

export default App;