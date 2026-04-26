import { useState, useRef, useEffect } from 'react';

const LOADING_MSGS = [
  'Adding some soul…',
  'Making it sound like a friend wrote this…',
  'Polishing with personality…',
  'Swapping robot words for human ones…',
  'Turning stiff prose into conversation…',
  'Sprinkling in some warmth…',
  'Teaching it to chill out a little…',
  'Humanizing in progress — hang tight…',
];

const MAX_CHARS = 5000;

/**
 * HumanizerForm — main input card with character counter and loading state.
 */
export default function HumanizerForm({ onHumanize, isLoading, prefill }) {
  const [text, setText] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [btnBounce, setBtnBounce] = useState(false);
  const textareaRef = useRef(null);
  const msgRef = useRef(0);

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;
    const pick = () => {
      setLoadingMsg(LOADING_MSGS[msgRef.current % LOADING_MSGS.length]);
      msgRef.current++;
    };
    pick();
    const id = setInterval(pick, 2200);
    return () => clearInterval(id);
  }, [isLoading]);

  // Prefill from history click
  useEffect(() => {
    if (prefill) {
      setText(prefill);
      textareaRef.current?.focus();
    }
  }, [prefill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    setBtnBounce(true);
    setTimeout(() => setBtnBounce(false), 350);
    onHumanize(text.trim());
    setText('');
  };

  const remaining = MAX_CHARS - text.length;
  const isNearLimit = remaining < 200;
  const isOverLimit = remaining < 0;

  return (
    <section className="card p-6 sm:p-8 space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl text-ink leading-tight">
          Paste your text
        </h2>
        <p className="text-ink-muted text-sm mt-1">
          Formal, robotic, or AI-generated — we'll warm it up.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="For example: 'Greetings. I am writing to inform you that the aforementioned deliverable has been completed in a satisfactory manner…'"
            rows={7}
            maxLength={MAX_CHARS + 50}
            disabled={isLoading}
            className="input-text scrollbar-thin"
            aria-label="Text to humanize"
          />
          {/* Character counter */}
          <span
            className={`absolute bottom-3 right-3 text-xs font-mono transition-colors
              ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-ink-muted/40'}`}
          >
            {remaining.toLocaleString()}
          </span>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 gap-3">
          {/* Paste helper */}
          <button
            type="button"
            onClick={async () => {
              try {
                const clip = await navigator.clipboard.readText();
                setText(clip.slice(0, MAX_CHARS));
              } catch { /* permission denied */ }
            }}
            className="btn-outline"
            disabled={isLoading}
          >
            <PasteIcon />
            Paste
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim() || isOverLimit || isLoading}
            className={`btn-primary ${btnBounce ? 'scale-95' : 'scale-100'} transition-transform`}
          >
            {isLoading ? (
              <>
                <SpinnerIcon />
                <span className="max-w-[160px] truncate text-xs opacity-90">{loadingMsg}</span>
              </>
            ) : (
              <>
                <WandIcon />
                Humanize
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
function WandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 4-1 1" /><path d="m19 8-1 1" /><path d="M4 15l-1 1" />
      <path d="m8 19-1 1" /><path d="M9 3H8" /><path d="M4 8H3" />
      <path d="M20 15h-1" /><path d="M15 20v-1" />
      <path d="m6.5 17.5-4-4 8-8 4 4z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
