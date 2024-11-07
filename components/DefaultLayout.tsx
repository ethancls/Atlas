import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react"

export const DefaultLayout = ({ children }: PropsWithChildren) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <Header>
                    <SidebarTrigger className="mt-3" />
                    <div className="flex w-50 items-center space-x-2 ml-auto">
                        <Input type="search" placeholder="Search" />
                        <Button variant="default" size="icon">
                            <SearchIcon />
                        </Button>
                    </div>
                </Header>
                {children}
            </main>
        </SidebarProvider>
    );
};