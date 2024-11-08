'use client';

import * as React from 'react';
import { Monitor, Moon, MoonStarIcon, Sun, SunDimIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [usedTheme, setUsedTheme] = React.useState(theme);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        setUsedTheme(newTheme);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                    <div className={`flex space-x-2 items-center justify-center ${usedTheme === 'light' ? 'text-cyan-300' : ''}`}>
                        <SunDimIcon className="h-4 w-4" />
                        <p className="font-semibold">Light</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                    <div className={`flex space-x-2 items-center justify-center ${usedTheme === 'dark' ? 'text-blue-300' : ''}`}>
                        <MoonStarIcon className="h-4 w-4" />
                        <p className="font-semibold">Dark</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                    <div className={`flex space-x-2 items-center justify-center ${usedTheme === 'system' ? 'text-blue-300' : ''}`}>
                        <Monitor className="h-4 w-4" />
                        <p className="font-semibold">System</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
