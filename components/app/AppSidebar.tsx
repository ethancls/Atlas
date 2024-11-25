import icon from "@/public/movie.png"
import { Atom, LoaderPinwheelIcon, LogOut, MedalIcon, PlayIcon, StarIcon, TrophyIcon } from "lucide-react"
import Image from "next/image"
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"
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
    icon: MedalIcon,
  },
  {
    title: "Top Rated",
    url: "/movies/top-rated",
    icon: TrophyIcon,
  }
]

const shows = [
  {
    title: "On The Air",
    url: "/shows/on-the-air",
    icon: LoaderPinwheelIcon,
  },
  {
    title: "Popular",
    url: "/shows/popular",
    icon: MedalIcon,
  },
  {
    title: "Top Rated",
    url: "/shows/top-rated",
    icon: TrophyIcon,
  }
]

const persons = [
  {
    title: "Popular",
    url: "/persons",
    icon: PersonIcon,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: StarIcon,
  }
]

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-4">
          <Image src={icon} alt="Logo" className="h-8 w-8 flex items-center justify-center" />
            {state !== "collapsed" && (
            <span className="text-xl font-bold">
              Atlas
            </span>
            )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} passHref>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center space-x-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
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
                  <Link href={movie.url} passHref>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center space-x-2">
                        <movie.icon />
                        <span>{movie.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
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
                  <Link href={show.url} passHref>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center space-x-2">
                        <show.icon />
                        <span>{show.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {persons.map((person) => (
                <SidebarMenuItem key={person.title}>
                  <Link href={person.url} passHref>
                    <SidebarMenuButton asChild>
                      <div className="flex items-center space-x-2">
                        <person.icon />
                        <span>{person.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          <LogOut />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
