import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

/**
 * Navigation component with responsive design and theme toggle
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Array of menu items {label, url}
 * @param {string} props.title - Blog title
 * @param {string} props.theme - Current theme (light/dark)
 * @param {Function} props.onThemeToggle - Theme toggle handler
 */
export function Navigation({ menuItems = [], title = 'BasicBlog', theme = 'light', onThemeToggle }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo/Title */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                {title}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.url}
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onThemeToggle}
                            className="ml-2"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onThemeToggle}
                            className="mr-2"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="space-y-1 pb-4 pt-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.url}
                                className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
