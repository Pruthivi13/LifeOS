'use client';

import Link from 'next/link';
import { Github, Twitter, Info, Heart, Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-foreground/5 bg-background-secondary/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Brand & Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-foreground-muted">
                    <span className="font-semibold text-foreground">LifeOS</span>
                    <span className="hidden md:inline">•</span>
                    <span>© {new Date().getFullYear()} All rights reserved</span>
                </div>

                {/* Center - Made with Love */}
                <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
                    <span>Built with</span>
                    <Heart className="w-3.5 h-3.5 text-soft-red fill-soft-red" />
                    <span>for productivity</span>
                </div>

                {/* Right - Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/about"
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        <span>About</span>
                    </Link>

                    <a
                        href="https://portfolio-ivory-sigma-60.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-primary transition-colors"
                        aria-label="Portfolio"
                        title="Portfolio"
                    >
                        <Globe className="w-5 h-5" />
                    </a>

                    <a
                        href="https://github.com/Pruthivi13"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                        aria-label="GitHub"
                    >
                        <Github className="w-5 h-5" />
                    </a>

                    <a
                        href="https://x.com/pjsucksatlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                        aria-label="Twitter"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
            </div >
        </footer >
    );
}
