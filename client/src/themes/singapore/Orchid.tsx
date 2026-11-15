const Orchid = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
    <ellipse cx="50" cy="22" rx="10" ry="20" />
    <ellipse cx="50" cy="22" rx="13" ry="21" transform="rotate(64 50 46)" />
    <ellipse cx="50" cy="22" rx="13" ry="21" transform="rotate(-64 50 46)" />
    <ellipse cx="50" cy="26" rx="9" ry="19" transform="rotate(142 50 46)" />
    <ellipse cx="50" cy="26" rx="9" ry="19" transform="rotate(-142 50 46)" />
    <path d="M50 50 C36 56 31 78 40 89 C46 96 54 96 60 89 C69 78 64 56 50 50 Z" />
    <circle cx="50" cy="46" r="10" />
    <circle cx="50" cy="46" r="3.5" fill="var(--color-sg-cream)" />
  </svg>
)

export default Orchid
