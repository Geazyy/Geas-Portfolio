'use client';

import { useTheme } from '../../context/ThemeContext';

const themes = [
  {
    id: 'system',
    label: 'System',
    icon: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  },
  {
    id: 'aqua-blue',
    label: 'Aqua Blue',
    icon: <><path d="M12 3.2s6.5 7.2 6.5 11.1a6.5 6.5 0 1 1-13 0C5.5 10.4 12 3.2 12 3.2Z" /><path d="M9 15.2a3.2 3.2 0 0 0 3.2 3.2" /></>,
  },
  {
    id: 'dark',
    label: 'Dark',
    icon: <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />,
  },
  {
    id: 'light',
    label: 'Light',
    icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mt-auto w-full">
      <p className="mb-2 px-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Appearance
      </p>
      <div className="grid grid-cols-4 gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1 shadow-sm">
        {themes.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className="theme-option flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]"
            aria-label={`${label} theme`}
            aria-pressed={theme === id}
            title={label}
            onClick={() => setTheme(id)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              {icon}
            </svg>
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
