import { useState } from 'react';

/**
 * HistoryList — shows past humanization entries with expand, copy, and delete.
 */
export default function HistoryList({ entries, onDelete, onSelect, onClearAll, isDeleting }) {
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* noop */ }
  };

  if (entries.length === 0) return <EmptyState />;

  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">
          Recent transformations
          <span className="ml-2 font-body text-sm text-ink-muted font-normal">
            ({entries.length})
          </span>
        </h2>
        {entries.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-ink-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Entry list */}
      <div className="space-y-2.5">
        {entries.map((entry, i) => {
          const isOpen = expanded === entry._id;
          return (
            <article
              key={entry._id}
              className="card card-hover overflow-hidden"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Top bar */}
              <div
                className="px-5 py-4 cursor-pointer flex items-start justify-between gap-3"
                onClick={() => toggle(entry._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggle(entry._id)}
                aria-expanded={isOpen}
              >
                <div className="flex-1 min-w-0">
                  {/* Stats row */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <TimeAgo date={entry.createdAt} />
                    {entry.transformCount > 0 && (
                      <span className="badge-teal">
                        {entry.transformCount} swap{entry.transformCount !== 1 ? 's' : ''}
                      </span>
                    )}
                    {entry.charDelta !== 0 && (
                      <span className="badge-neutral">
                        {entry.charDelta > 0 ? `+${entry.charDelta}` : entry.charDelta} chars
                      </span>
                    )}
                  </div>
                  {/* Preview */}
                  <p className="text-sm text-ink-muted line-clamp-1 font-mono text-xs leading-relaxed">
                    {entry.originalText}
                  </p>
                </div>

                <ChevronIcon open={isOpen} />
              </div>

              {/* Expanded view */}
              {isOpen && (
                <div className="border-t border-cream-200 divide-y divide-cream-200 animate-fade-up">
                  {/* Original */}
                  <TextBlock
                    label="Original"
                    text={entry.originalText}
                    variant="muted"
                    onCopy={() => copy(entry.originalText, `orig-${entry._id}`)}
                    copied={copied === `orig-${entry._id}`}
                    onUseAgain={() => onSelect(entry.originalText)}
                  />
                  {/* Humanized */}
                  <TextBlock
                    label="Humanized ✨"
                    text={entry.humanizedText}
                    variant="warm"
                    onCopy={() => copy(entry.humanizedText, `hum-${entry._id}`)}
                    copied={copied === `hum-${entry._id}`}
                  />
                  {/* Actions */}
                  <div className="px-5 py-3 flex justify-end">
                    <button
                      onClick={() => onDelete(entry._id)}
                      disabled={isDeleting}
                      className="btn-ghost"
                      aria-label="Delete entry"
                    >
                      <TrashIcon />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TextBlock({ label, text, variant, onCopy, copied, onUseAgain }) {
  return (
    <div className={`px-5 py-4 ${variant === 'warm' ? 'bg-amber-50/40' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
          {label}
        </span>
        <div className="flex gap-2">
          {onUseAgain && (
            <button onClick={onUseAgain} className="text-xs text-ink-muted hover:text-ink transition-colors">
              ↩ Re-edit
            </button>
          )}
          <button
            onClick={onCopy}
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words
        ${variant === 'warm' ? 'text-ink' : 'text-ink-muted font-mono text-xs'}`}>
        {text}
      </p>
    </div>
  );
}

function TimeAgo({ date }) {
  const now = new Date();
  const d   = new Date(date);
  const sec = Math.floor((now - d) / 1000);
  let label;
  if (sec < 60)          label = `${sec}s ago`;
  else if (sec < 3600)   label = `${Math.floor(sec / 60)}m ago`;
  else if (sec < 86400)  label = `${Math.floor(sec / 3600)}h ago`;
  else                   label = d.toLocaleDateString();

  return (
    <time dateTime={d.toISOString()} className="text-[11px] text-ink-muted/70 font-mono">
      {label}
    </time>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      className={`flex-shrink-0 text-ink-muted transition-transform duration-200 mt-0.5
        ${open ? 'rotate-180' : ''}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="card p-10 text-center space-y-4">
      <div className="font-mono text-3xl leading-snug text-ink-muted/60 select-none">
        <pre>{`
  [🤖] ─────> [😊]
        `}</pre>
      </div>
      <p className="text-ink-muted text-sm">
        No transformations yet. Paste some robotic text above and hit{' '}
        <strong className="text-ink">Humanize</strong>!
      </p>
    </div>
  );
}
