import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

const colorGradients = [
    {
        name: "Purple",
        value: "radial-gradient(circle 50px at $x $y, rgba(128, 0, 255, 0.3) 0%, transparent 70%)"
    },
    {
        name: "Rainbow",
        value: "radial-gradient(circle 40px at $x $y, rgba(255, 0, 0, 0.2) 0%, rgba(0, 255, 0, 0.2) 35%, rgba(0, 0, 255, 0.2) 70%, transparent 100%)"
    },
    {
        name: "Neon",
        value: "radial-gradient(circle 40px at $x $y, rgba(255, 0, 255, 0.3) 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)"
    },
    {
        name: "Sunset",
        value: "radial-gradient(circle 50px at $x $y, rgba(255, 165, 0, 0.3) 0%, rgba(255, 0, 128, 0.3) 50%, transparent 100%)"
    },
    {
        name: "Northern Lights",
        value: "radial-gradient(circle 50px at $x $y, rgba(0, 255, 200, 0.3) 0%, rgba(0, 128, 255, 0.3) 50%, transparent 100%)"
    },
    {
        name: "Green",
        value: "radial-gradient(circle 50px at $x $y, rgba(0, 255, 0, 0.3) 0%, transparent 70%)"
    },
    {
        name: "Red",
        value: "radial-gradient(circle 50px at $x $y, rgba(255, 0, 0, 0.3) 0%, transparent 70%)"
    },
    {
        name: "Blue",
        value: "radial-gradient(circle 50px at $x $y, rgba(0, 0, 255, 0.3) 0%, transparent 70%)"
    },
    {
        name: "None",
        value: "none"
    }
  ];

export const FlashlightToggle = ({ onChange }: { onChange: (gradient: string) => void }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Palette className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {colorGradients.map((gradient) => (
                    <DropdownMenuItem
                        key={gradient.name}
                        onClick={() => onChange(gradient.value)}
                    >
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-4 h-4 rounded"
                                style={{ background: gradient.value.replace('$x $y', '50% 50%') }}
                            />
                            {gradient.name}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};