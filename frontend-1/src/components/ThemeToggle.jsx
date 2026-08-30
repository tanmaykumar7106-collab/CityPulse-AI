import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="theme-toggle-btn"
        >
            <span className="theme-toggle-circle">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </span>
        </button>
    );
}

export default ThemeToggle;