// Simple currentColor line icons — inherit whatever text color/dark:
// classes the caller sets, instead of needing separate light/dark image
// assets or CSS invert filters like the old colored PNG icons did.

export const FacebookIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36c-.27-.04-1.2-.11-2.28-.11-2.25 0-3.79 1.37-3.79 3.9V10.5H8v3h2.43V21h3.07Z" />
    </svg>
)

export const InstagramIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
)

export const XIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.75 10.6 20.4 3h-1.58l-5.77 6.6L8.44 3H3l6.98 10.01L3 21h1.58l6.1-6.97L15.56 21H21l-7.25-10.4Zm-2.16 2.47-.71-1-5.62-7.9h2.42l4.53 6.36.71 1 5.9 8.28h-2.42l-4.81-6.74Z" />
    </svg>
)
