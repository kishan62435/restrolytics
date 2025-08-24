'use client';

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme} 
            className="rounded-lg p-2 transition-all duration-200 hover:bg-muted border border-border"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            { theme === 'light' ? '🌙' : '☀️'}
        </button>
    )
}