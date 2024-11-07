import { Atom, Calendar, Home, Inbox, LoaderPinwheelIcon, PlayIcon, Search, Settings, TrophyIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PersonIcon } from "@radix-ui/react-icons"

// Menu items.
const items = [
  {
    title: "Discover",
    url: "/discover",
    icon: Atom,
  }
]

const movies = [
  {
    title: "Now Playing",
    url: "/movies/now-playing",
    icon: PlayIcon,
  },
  {
    title: "Popular",
    url: "/movies/popular",
    icon: PersonIcon,
  },
  {
    title: "Top Rated",
    url: "/movies/top-rated",
    icon: TrophyIcon,
  }
]

const shows = [
  {
    title: "On Air",
    url: "/shows/on-the-air",
    icon: LoaderPinwheelIcon,
  },
  {
    title: "Popular",
    url: "/shows/popular",
    icon: PersonIcon,
  },
  {
    title: "Top Rated",
    url: "/shows/top-rated",
    icon: TrophyIcon,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-x-3">
          <img src="https://atlas-seven-tau.vercel.app/favicon.ico" className="h-12 w-12" />
          <h1 className="text-xl font-bold p-4">Atlas</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Movies</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {movies.map((movie) => (
                <SidebarMenuItem key={movie.title}>
                  <SidebarMenuButton asChild>
                    <a href={movie.url}>
                      <movie.icon />
                      <span>{movie.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Shows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {shows.map((show) => (
                <SidebarMenuItem key={show.title}>
                  <SidebarMenuButton asChild>
                    <a href={show.url}>
                      <show.icon />
                      <span>{show.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}