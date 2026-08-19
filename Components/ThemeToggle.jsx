'use client'
import { useEffect, useState } from 'react'

const SunIcon = ({ className }) => (
    <svg viewBox="0 0 20 20" fill="none" className={className} width={18} height={18}>
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8L4.4 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
)

const MoonIcon = ({ className }) => (
    <svg viewBox="0 0 20 20" fill="none" className={className} width={18} height={18}>
        <path d="M17 11.5A7.5 7.5 0 118.5 3a6 6 0 108.5 8.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
)

const ThemeToggle = ({ className = '' }) => {
    const [isDark, setIsDark] = useState(null)

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'))
    }, [])

    const toggleTheme = () => {
        const next = !isDark
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
        setIsDark(next)
    }

    if (isDark === null) {
        return <div className={`w-[34px] h-[34px] ${className}`} />
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={`flex items-center justify-center w-[34px] h-[34px] rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all ${className}`}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
    )
}

export default ThemeToggle
