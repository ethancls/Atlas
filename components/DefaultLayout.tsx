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
                    <SidebarTrigger/>
                    <div className="flex w-50 items-center space-x-2 ml-auto p-3">
                        <Input type="search" placeholder="Search" />
                        <Button variant="default" size="icon">
                            <SearchIcon className="space-x-2"/>
                        </Button>
                    </div>
                </Header>
                {children}
            </main>
        </SidebarProvider>
    );
};