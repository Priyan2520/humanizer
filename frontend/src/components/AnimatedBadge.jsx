import { useEffect, useState } from 'react';

/**
 * AnimatedBadge — appears with a sparkle animation.
 * @param {{ label?: string, show: boolean }} props
 */
export default function AnimatedBadge({ label = '✨ Humanized', show }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    } else {
      setMounted(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <span
      className={`badge-amber font-mono text-[11px] tracking-wide select-none
        transition-all duration-300
        ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-90'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
    >
      <SparkleIcon />
      {label}
    </span>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block"
      aria-hidden="true"
    >
      <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
    </svg>
  );
}
