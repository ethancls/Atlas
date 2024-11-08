import { PropsWithChildren, useState } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "./ui/input";
import { MovieDetailPage } from "@/components/Search";
import icon from "@/assets/atlas.png";
import Image from "next/image";
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
                    <div className="flex justify-center p-1 gap-x-1">
                        <h1 className="text-xl font-bold p-2">Atlas</h1>
                    </div>
                    <div className="flex w-30  md:w-50 lg:w-80 items-center space-x-2 ml-auto p-3">
                        <ModeToggle />
                        <Input onChange={(e) => handleSearch(e.target.value)} type="search" placeholder="Search..." className="flex-grow" />
                    </div>
                </Header>
                <SidebarTrigger />
                {query ? <MovieDetailPage query={query} /> : children}
            </main>
        </SidebarProvider>
    );
};
