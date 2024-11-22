"use client";
import { PropsWithChildren, useState } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "./ui/input";
import { MultiSearch, MovieSearch, TVShowSearch, PersonSearch } from "@/components/Search";
import { ModeToggle } from "./ModeToggle";

export const DefaultLayout = ({ children }: PropsWithChildren) => {
    const [query, setQuery] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        setQuery(query);
    };

    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="w-full">
                <Header>
                    <div className="flex items-center space-x-2 p-2">
                        <SidebarTrigger />
                    </div>
                    <div className="flex w-30 md:w-50 lg:w-80 items-center space-x-2 ml-auto p-2">
                        <ModeToggle />
                        <Input onChange={(e) => handleSearch(e.target.value)} type="search" placeholder="Search..." className="flex-grow" />
                    </div>
                </Header>
                {query ? window.location.href.includes("movies") ? (
                    <MovieSearch query={query ?? ""} />
                ) : window.location.href.includes("shows") ? (
                    <TVShowSearch query={query ?? ""} />
                ) : window.location.href.includes("persons") ? (
                    <PersonSearch query={query ?? ""} />
                ) : window.location.href.includes("discover") ? (
                    <MultiSearch query={query ?? ""} />
                ) : (
                    children
                ) : (children)}
            </main>
        </SidebarProvider>

    );
};
