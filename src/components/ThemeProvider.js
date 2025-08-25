'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            setTheme(savedTheme);
        }
        else {
            // const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            // setTheme(systemTheme);
        }
    }, []);

    useEffect(() => {

        document.documentElement.classList.remove('dark', 'light');
        if(theme === 'dark') {
            document.documentElement.classList.add('dark')
        }
        else{
            document.documentElement.classList.add('light')
        }

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }

    return ( 
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
            <ThemeToggle/>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if(!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context;
}