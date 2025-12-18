"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { planetaryPairs } from "@/data/planetaryPairs";
import { BookOpen, Dices, Home, Sparkles, User, Moon, Sun, LogOut, MessageSquare } from "lucide-react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// Simple placeholder when Clerk isn't configured
function AccountPlaceholder() {
  return (
    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
      <User className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const syncUser = useMutation(api.users.syncUser);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync user to Convex when authenticated
  useEffect(() => {
    if (user && isLoaded) {
      syncUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).catch((error) => {
        console.error("Failed to sync user:", error);
      });
    }
  }, [user, isLoaded, syncUser]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Planetary Pairs
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard"}
                    >
                      <Link href="/dashboard">
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Planetary Pairs</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {planetaryPairs.map((pair) => (
                    <SidebarMenuItem key={pair.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/${pair.slug}`}
                      >
                        <Link href={`/${pair.slug}`}>
                          <span className="text-base">
                            {pair.planet1.symbol}
                          </span>
                          <span>
                            {pair.planet1.name}/{pair.planet2.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Explore</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/randomizer"}
                    >
                      <Link href="/randomizer">
                        <Dices className="h-4 w-4" />
                        <span>Cosmic Randomizer</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/understanding-phases-aspects"}
                    >
                      <Link href="/understanding-phases-aspects">
                        <BookOpen className="h-4 w-4" />
                        <span>Phases & Aspects</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Community</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/community" || pathname.startsWith("/community/")}
                    >
                      <Link href="/community">
                        <MessageSquare className="h-4 w-4" />
                        <span>Forum</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="space-y-3">
              {isLoaded && user ? (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.firstName || user.emailAddresses[0].emailAddress}
                    </p>
                  </div>
                  <SignOutButton>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </SignOutButton>
                </div>
              ) : isLoaded ? (
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
              ) : (
                <div className="flex items-center gap-3">
                  <AccountPlaceholder />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            {isLoaded && user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress.split('@')[0]}
                </span>
              </div>
            )}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
