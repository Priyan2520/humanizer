import { useState, useEffect, useCallback } from 'react';
import HumanizerForm from './components/HumanizerForm';
import HistoryList from './components/HistoryList';
import AnimatedBadge from './components/AnimatedBadge';
import { humanizeText, fetchEntries, deleteEntry, clearEntries } from './api/client';

export default function App() {
  const [entries,    setEntries]    = useState([]);
  const [result,     setResult]     = useState(null);   // { text, transformCount, charDelta }
  const [isLoading,  setIsLoading]  = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error,      setError]      = useState(null);
  const [prefill,    setPrefill]    = useState(null);

  // ─── Load history ────────────────────────────────────────────────────────────
  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchEntries();
      setEntries(data.entries ?? []);
    } catch (err) {
      console.error('fetchEntries:', err.message);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  // ─── Humanize ────────────────────────────────────────────────────────────────
  const handleHumanize = async (text) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await humanizeText(text);
      setResult({
        text: data.humanizedText,
        transformCount: data.transformCount,
        charDelta: data.charDelta,
      });
      await loadEntries();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Delete single ────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Clear all ────────────────────────────────────────────────────────────────
  const handleClearAll = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    try {
      await clearEntries();
      setEntries([]);
      setResult(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <header className="border-b border-cream-200 bg-white/60 backdrop-blur sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-3xl">
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-ink tracking-tight">
              ✍️ Humanizer
            </h1>
            <p className="text-ink-muted text-xs hidden sm:block">
              from robotic → conversational
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Priyan2520/humanizer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl space-y-6">

        {/* Form */}
        <HumanizerForm
          onHumanize={handleHumanize}
          isLoading={isLoading}
          prefill={prefill}
        />

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700
            px-4 py-3 rounded-xl text-sm animate-fade-up">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="opacity-80">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 leading-none"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Result card */}
        {result && (
          <ResultCard
            result={result}
            onDismiss={() => setResult(null)}
          />
        )}

        {/* History */}
        {isFetching ? (
          <HistorySkeleton />
        ) : (
          <HistoryList
            entries={entries}
            onDelete={handleDelete}
            onSelect={(text) => { setPrefill(text); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onClearAll={handleClearAll}
            isDeleting={isDeleting}
          />
        )}
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-cream-200 bg-white/40 py-6 mt-4">
        <p className="text-center text-xs text-ink-muted">
          Humanizer — hand-crafted with ☕ and kindness &nbsp;·&nbsp;
          <a
            href="https://github.com/Priyan2520/humanizer"
            className="underline underline-offset-2 hover:text-ink transition-colors"
          >
            Priyan2520/humanizer
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────
function ResultCard({ result, onDismiss }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="card border-amber-200 bg-amber-50/50 p-6 animate-pop space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-base text-ink">Result</span>
          <AnimatedBadge show label="✨ Humanized" />
          {result.transformCount > 0 && (
            <span className="badge-teal">{result.transformCount} swaps</span>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-ink-muted hover:text-ink-light transition-colors text-lg leading-none"
          aria-label="Dismiss result"
        >
          ×
        </button>
      </div>

      {/* Text */}
      <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap break-words">
        {result.text}
      </p>

      {/* Copy */}
      <button onClick={copy} className="btn-outline text-xs">
        {copied ? '✓ Copied to clipboard!' : '📋 Copy text'}
      </button>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function HistorySkeleton() {
  return (
    <div className="space-y-2.5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-5 animate-pulse-warm">
          <div className="h-3 bg-cream-200 rounded w-24 mb-3" />
          <div className="h-2.5 bg-cream-200 rounded w-full mb-1.5" />
          <div className="h-2.5 bg-cream-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

// ─── GitHub Icon ──────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
        0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7
        3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
        1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332
        -5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322
        3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23
        3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805
        5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69
        .825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
