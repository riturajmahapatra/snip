import { useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080";

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="5"
        y="5"
        width="8"
        height="8"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M3 10V2h8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2.5 7.5L6 11L12.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkRow({ item, onCopy, copiedId }) {
  const isCopied = copiedId === item.id;

  return (
    <div className="link-row">
      <div className="link-original">{item.url}</div>
      <div className="link-right">
        <a
          className="link-short"
          href={item.shortUrl}
          target="_blank"
          rel="noreferrer">
          {item.shortUrl.replace("http://", "")}
        </a>
        <button
          className={`copy-btn ${isCopied ? "copied" : ""}`}
          onClick={() => onCopy(item.id, item.shortUrl)}
          aria-label="Copy short link">
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span>{isCopied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleShorten() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setLinks((prev) => [
        { id: Date.now(), url: trimmed, shortUrl: data.short_url },
        ...prev,
      ]);
      setInput("");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Is your backend running on port 8080?"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleShorten();
  }

  function handleCopy(id, text) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-dot" />
          <span className="logo-text">snip</span>
        </div>
      </header>

      <main className="main">
        <div className="hero-text">
          <h1>
            Short links,
            <br />
            <em>instantly.</em>
          </h1>
          <p className="subtitle">
            Paste a long URL and get a clean, shareable link in seconds.
          </p>
        </div>

        <div className="input-area">
          <div className={`input-wrap ${error ? "has-error" : ""}`}>
            <span className="input-prefix">https://</span>
            <input
              type="url"
              className="url-input"
              placeholder="your-very-long-url.com/with/lots/of/stuff"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label="URL to shorten"
            />
            <button
              className={`shorten-btn ${loading ? "loading" : ""}`}
              onClick={handleShorten}
              disabled={loading}>
              {loading ? <span className="spinner" /> : "Shorten"}
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </div>

        {links.length > 0 && (
          <div className="results">
            <div className="results-header">
              <span>
                {links.length} link{links.length !== 1 ? "s" : ""}
              </span>
              <button className="clear-btn" onClick={() => setLinks([])}>
                Clear all
              </button>
            </div>
            <div className="links-list">
              {links.map((item) => (
                <LinkRow
                  key={item.id}
                  item={item}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>© 2026 snip</span>
        <span className="footer-sep">·</span>
        <span>Powered by Spring Boot · localhost:8080</span>
      </footer>
    </div>
  );
}
