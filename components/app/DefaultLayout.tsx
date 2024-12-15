"use client";
import { PropsWithChildren, useState } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "../ui/input";
import { MultiSearch, MovieSearch, TVShowSearch, PersonSearch } from "@/components/app/Search";
import { ModeToggle } from "./ModeToggle";
import FlashlightBackground from "./FlashLightBackground";
import { FlashlightToggle } from "./ColorToggle";




export const DefaultLayout = ({ children }: PropsWithChildren) => {
    const [query, setQuery] = useState<string | null>(null);
    const [flashlightGradient, setFlashlightGradient] = useState("radial-gradient(circle 60px at $x $y, rgba(225, 0, 230, 0.3) 0%, transparent 70%)");

    const handleSearch = (query: string) => {
        setQuery(query);
    };

    return (
        <FlashlightBackground gradient={flashlightGradient}>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <main className="w-full">
                    <Header>
                        <div className="flex items-center p-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex w-30 md:w-50 lg:w-80 items-center space-x-2 ml-auto p-2">
                            <FlashlightToggle onChange={setFlashlightGradient} />
                            <ModeToggle />
                            <Input
                                onChange={(e) => handleSearch(e.target.value)}
                                type="search"
                                placeholder="Search..."
                                className="flex-grow"
                            />
                        </div>
                    </Header>
                    {query ? typeof window !== "undefined" && window.location.href.includes("movies") ? (
                        <MovieSearch query={query ?? ""} />
                    ) : typeof window !== "undefined" && window.location.href.includes("shows") ? (
                        <TVShowSearch query={query ?? ""} />
                    ) : typeof window !== "undefined" && window.location.href.includes("persons") ? (
                        <PersonSearch query={query ?? ""} />
                    ) : typeof window !== "undefined" && window.location.href.includes("discover") ? (
                        <MultiSearch query={query ?? ""} />
                    ) : (
                        children
                    ) : (children)}
                </main>
            </SidebarProvider>
        </FlashlightBackground>
    );
};
