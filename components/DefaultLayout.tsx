import { PropsWithChildren, useState } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "./ui/input";
import { MovieDetailPage } from "@/components/Search";
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
                    <h1 className="flex text-2xl font-bold p-4 text-center">Atlas</h1>
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
