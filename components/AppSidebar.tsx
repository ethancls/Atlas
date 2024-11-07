import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Discover",
    url: "/discover",
    icon: Inbox,
  }
]

const movies = [
  {
    title: "Now Playing",
    url: "/movies/now-playing",
    icon: Calendar,
  },
  {
    title: "Popular",
    url: "/movies/popular",
    icon: Inbox,
  },
  {
    title: "Top Rated",
    url: "/movies/top-rated",
    icon: Search,
  }
]

const shows = [
  {
    title: "On Air",
    url: "/shows/on-the-air",
    icon: Calendar,
  },
  {
    title: "Popular",
    url: "/shows/popular",
    icon: Inbox,
  },
  {
    title: "Top Rated",
    url: "/shows/top-rated",
    icon: Search,
  }
]

const others = [
  {
    title: "Movies",
    url: "/api/movies",
    icon: Calendar,
  },
  {
    title: "Shows",
    url: "/api/shows",
    icon: Inbox,
  },
  {
    title: "Discover",
    url: "/api/discover",
    icon: Search,
  },
  {
    title: "Genres",
    url: "/api/genres",
    icon: Search,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-x-3">
          <img src="https://atlas-seven-tau.vercel.app/favicon.ico" className="h-8 w-8" />
          <h1 className="text-xl font-bold p-2">Atlas</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Movies</SidebarGroupLabel>
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
        <SidebarGroup>
          <SidebarGroupLabel>API</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {others.map((other) => (
                <SidebarMenuItem key={other.title}>
                  <SidebarMenuButton asChild>
                    <a href={other.url}>
                      <other.icon />
                      <span>{other.title}</span>
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